import { Field, ObjectType } from "type-graphql";
import { Entity, Column, UpdateDateColumn, CreateDateColumn, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field(() => Number)
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => String)
    @Column()
    name!: string

    @Field(() => String)
    @Column({ unique: true })
    email!: string;

    @Field(() => String)
    @Column({ unique: true })
    username!: string

    @Column()
    password!: string

    @Field(() => Date)
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt!: Date;

    @Field(() => Date)
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt!: Date;
}