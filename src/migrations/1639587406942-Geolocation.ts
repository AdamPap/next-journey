import {MigrationInterface, QueryRunner} from "typeorm";

export class Geolocation1639587406942 implements MigrationInterface {
    name = 'Geolocation1639587406942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campground" ADD "longitude" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campground" ADD "latitude" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campground" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "campground" DROP COLUMN "longitude"`);
    }

}
