import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { Campground } from '../entities/Campground'

@Resolver()
export class CampgroundResolver {
    @Query(() => [Campground])
    async campgrounds() {
        return Campground.find()
    }

    @Query(() => Campground, { nullable: true })
    async campground(@Arg("id", () => Int) id: number): Promise<Campground | undefined> {
        return Campground.findOne(id)
    }

    @Mutation(() => Campground)
    async createCampground(
        @Arg("name") name: string,
        @Arg("location") location: string
    ): Promise<Campground> {
        return Campground.create({ name, location }).save()
    }

    @Mutation(() => Campground, { nullable: true })
    async updateCampground(
        @Arg("id", () => Int) id: number,
        @Arg("name") name: string,
        @Arg("location") location: string,

    ): Promise<Campground | undefined> {
        const campground = await Campground.findOne(id)
        if (!campground) {
            return undefined
        }
        campground.name = name
        campground.location = location
        await Campground.update(id, campground)

        return campground
    }

    @Mutation(() => Boolean)
    async deleteCampground(
        @Arg("id", () => Int) id: number
    ): Promise<boolean> {
        try {
            await Campground.delete(id)
            return true
        } catch (err) {
            return false
        }
    }
}