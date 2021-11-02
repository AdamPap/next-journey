import {
  Arg,
  Args,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Campground } from "../entities/Campground";
import { Upvote } from "../entities/Upvote";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

// @InputType()
// class CampgroundInput {
//   @Field()
//   name!: string;
//   @Field()
//   location!: string;
// }

@ObjectType()
class PaginatedCampgrounds {
  @Field(() => [Campground])
  campgrounds!: Campground[];
  @Field()
  hasMore!: boolean;
}

@Resolver()
export class CampgroundResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("campgroundId", () => Int) campgroundId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const userId = req.session.userId;

    // make sure votes has value 1 or -1
    const isUpvote = value !== -1;
    const val = isUpvote ? 1 : -1;

    const upvote = await Upvote.findOne({
      campgroundId,
      userId,
    });

    // user has already votes for this camp
    // or is voting the same
    if (upvote && upvote.value !== val) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          update upvote 
          set value = $1
          where "campgroundId" = $2 and "userId" = $3
        `,
          [val, campgroundId, userId]
        );

        await tm.query(
          `
          update campground 
          set points = points + $1
          where id = $2;
        `,
          // 2*val because changing vote is dif by 2
          [2 * val, campgroundId]
        );
      });
    } else if (!upvote) {
      // has not voted yet
      // typeorm handles the transaction
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          insert into upvote ("userId", "campgroundId", value)
          values ($1, $2, $3);
        `,
          [userId, campgroundId, val]
        );

        await tm.query(
          `
          update campground 
          set points = points + $1
          where id = $2;
        `,
          [val, campgroundId]
        );
      });
    }

    return true;
  }

  @Query(() => PaginatedCampgrounds)
  async campgrounds(
    @Arg("limit", () => Int) limit: number,
    // NOTE: have to explicitly set the type with ()=>String
    // when it can be nullable
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedCampgrounds> {
    const realLimit = Math.min(20, limit);
    // NOTE: +1 to fetch +1 and check if there is more
    const realLimitPlusOne = realLimit + 1;

    const queryBuilder = getConnection()
      .getRepository(Campground)
      .createQueryBuilder("c")
      .innerJoinAndSelect(
        "c.creator",
        // this is an alias
        "user",
        'user.id = c."creatorId"'
      )
      .orderBy("c.createdAt", "DESC")
      .take(realLimitPlusOne);

    // NOTE: if there is a latest camp (cursor)
    // get the next oldest posts
    if (cursor) {
      queryBuilder.where("c.createdAt < :cursor", {
        cursor: new Date(cursor),
      });
    }

    const campgrounds = await queryBuilder.getMany();

    return {
      campgrounds: campgrounds.slice(0, realLimit),
      hasMore: campgrounds.length === realLimitPlusOne,
    };
  }

  @Query(() => Campground, { nullable: true })
  async campground(
    @Arg("id", () => Int) id: number
  ): Promise<Campground | undefined> {
    return Campground.findOne(id);
  }

  @Mutation(() => Campground)
  @UseMiddleware(isAuth)
  async createCampground(
    @Arg("name") name: string,
    @Arg("location") location: string,
    @Ctx() { req }: MyContext
  ): Promise<Campground> {
    return Campground.create({
      name,
      location,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Campground, { nullable: true })
  @UseMiddleware(isAuth)
  async updateCampground(
    @Arg("id", () => Int) id: number,
    @Arg("name") name: string,
    @Arg("location") location: string
  ): Promise<Campground | undefined> {
    const campground = await Campground.findOne(id);
    if (!campground) {
      return undefined;
    }
    // TODO: check if name and location are defined
    campground.name = name;
    campground.location = location;
    await Campground.update(id, campground);
    // OR await Campground.update({id}, {name}, {location})

    return campground;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteCampground(@Arg("id", () => Int) id: number): Promise<boolean> {
    try {
      await Campground.delete(id);
      return true;
    } catch (err) {
      return false;
    }
  }
}
