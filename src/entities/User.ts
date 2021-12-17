import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Campground } from "./Campground";
import { Upvote } from "./Upvote";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => String)
  @Column({ unique: true })
  email!: string;

  @Field(() => String)
  @Column({ unique: true })
  username!: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isAdmin!: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  isAccepted!: boolean;

  @Column()
  password!: string;

  @OneToMany(() => Campground, (campground) => campground.creator)
  campgrounds?: Campground[];

  @OneToMany(() => Upvote, (upvote) => upvote.user)
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
