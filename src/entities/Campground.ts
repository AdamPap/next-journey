import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Place } from "./Place";

@Entity()
export class Campground extends Place {

    @PrimaryGeneratedColumn()
    id!: number;

}