import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class Place extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string


}