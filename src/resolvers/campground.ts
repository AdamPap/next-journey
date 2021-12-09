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
import cloudinary from "cloudinary";

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
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedCampgrounds> {
    const realLimit = Math.min(20, limit);
    // NOTE: +1 to fetch +1 and check if there is more
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];

    if (req.session.userId) {
      replacements.push(req.session.userId);
    }

    let cursorIndex = 3;
    if (cursor) {
      console.log("CURSOR: ", cursor);
      replacements.push(new Date(cursor));
      cursorIndex = replacements.length;
    }

    const campgrounds = await getConnection().query(
      `
    select c.*,
    json_build_object(
      'id', u.id,
      'username', u.username,
      'email', u.email,
      'name', u.name,
      'createdAt', u."createdAt",
      'updatedAt', u."updatedAt"
      ) creator,
    ${
      req.session.userId
        ? '(select value from upvote where "userId" = $2 and "campgroundId" = c.id) "voteStatus"'
        : 'null as "voteStatus"'
    }
    from campground c
    inner join public.user u on u.id = c."creatorId"
    ${cursor ? `where c."createdAt" < $${cursorIndex}` : ""}
    order by c."createdAt" DESC
    limit $1
    `,
      replacements
    );

    // const queryBuilder = getConnection()
    //   .getRepository(Campground)
    //   .createQueryBuilder("c")
    //   .innerJoinAndSelect(
    //     "c.creator",
    //     // this is an alias
    //     "user",
    //     'user.id = c."creatorId"'
    //   )
    //   .orderBy("c.createdAt", "DESC")
    //   .take(realLimitPlusOne);

    // // NOTE: if there is a latest camp (cursor)
    // // get the next oldest posts
    // if (cursor) {
    //   queryBuilder.where("c.createdAt < :cursor", {
    //     cursor: new Date(cursor),
    //   });
    // }

    // queryBuilder
    //   .addSelect('c."voteStatus"')
    //   .from(Upvote, "u")
    //   .where("userId = :id", { id: req.session.userId })
    //   .andWhere("campgroundId = c.id");

    // const campgrounds = await queryBuilder.getMany();

    return {
      campgrounds: campgrounds.slice(0, realLimit),
      hasMore: campgrounds.length === realLimitPlusOne,
    };
  }

  @Query(() => Campground, { nullable: true })
  async campground(
    @Arg("id", () => Int) id: number
  ): Promise<Campground | undefined> {
    return Campground.findOne(id, { relations: ["creator"] });
  }

  @Mutation(() => Campground)
  @UseMiddleware(isAuth)
  async createCampground(
    @Arg("name") name: string,
    @Arg("location") location: string,
    @Arg("image") image: string,
    @Ctx() { req }: MyContext
  ): Promise<Campground> {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
      const result = await cloudinary.v2.uploader.upload(image, {
        allowed_formats: ["jpg", "png"],
        public_id: "",
        folder: "next-journey",
      });

      const camp = Campground.create({
        name,
        location,
        image: result.public_id,
        creatorId: req.session.userId,
      }).save();

      return camp;
    } catch (err) {
      console.log(err);
      throw new Error("Image upload failed");
    }
  }

  @Mutation(() => Campground, { nullable: true })
  @UseMiddleware(isAuth)
  async updateCampground(
    @Arg("id", () => Int) id: number,
    @Arg("name") name: string,
    @Arg("location") location: string,
    @Ctx() { req }: MyContext
  ): Promise<Campground | undefined> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Campground)
      .set({ name, location })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteCampground(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    // NOTE: not cascade way
    /* const campground = await Campground.findOne(id);
    if (!campground) {
      return false;
    }

    if (campground?.creatorId !== req.session.userId) {
      throw new Error("Not Authorized");
    }

    await Upvote.delete({ campgroundId: id });
    await Campground.delete({ id });
    */

    await Campground.delete({ id, creatorId: req.session.userId });
    return true;
  }
}
