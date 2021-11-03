import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Campground } from "./Campground";
import { User } from "./User";

@ObjectType()
@Entity()
export class Upvote extends BaseEntity {
  @Field()
  @Column({ type: "int" })
  value!: number;

  @Field()
  @PrimaryColumn()
  userId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.upvotes)
  user!: User;

  @Field()
  @PrimaryColumn()
  campgroundId!: number;

  @Field(() => Campground)
  @ManyToOne(() => Campground, (campground) => campground.upvotes, {
    onDelete: "CASCADE",
  })
  campground!: Campground;
}
