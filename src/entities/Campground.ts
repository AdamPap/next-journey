import { Field, Int, ObjectType, Float } from "type-graphql";
import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Upvote } from "./Upvote";
import { User } from "./User";

type GeoType = "Point";
type GeoCoordinates = [number, number];

@ObjectType()
@Entity()
export class Campground extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => String)
  @Column()
  location!: string;

  @Field(() => Float)
  @Column({ type: "real" })
  longitude!: number;

  @Field(() => Float)
  @Column({ type: "real" })
  latitude!: number;

  @Field(() => String)
  @Column()
  image!: string;

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field(() => Int, { nullable: true })
  voteStatus?: number | null;

  @Field()
  @Column()
  creatorId!: number;

  @Field()
  //NOTE: this is setting up a FK to the users table
  @ManyToOne(() => User, (user) => user.campgrounds)
  //NOTE: User type is ObjectType so it exposes it's fields in GraphQL
  creator!: User;

  @OneToMany(() => Upvote, (upvote) => upvote.campground)
  upvotes?: Upvote[];

  @Field(() => Date)
  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt!: Date;
}
