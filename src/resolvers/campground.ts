import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Campground } from "../entities/Campground";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

// @InputType()
// class CampgroundInput {
//   @Field()
//   name!: string;
//   @Field()
//   location!: string;
// }

@Resolver()
export class CampgroundResolver {
  @Query(() => [Campground])
  async campgrounds() {
    return Campground.find();
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
