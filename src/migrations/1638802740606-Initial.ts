import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1638802740606 implements MigrationInterface {
    name = 'Initial1638802740606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "upvote" ("value" integer NOT NULL, "userId" integer NOT NULL, "campgroundId" integer NOT NULL, CONSTRAINT "PK_036379459cb09fad0dba3685281" PRIMARY KEY ("userId", "campgroundId"))`);
        await queryRunner.query(`CREATE TABLE "campground" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "location" character varying NOT NULL, "points" integer NOT NULL DEFAULT '0', "creatorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_1a5f05bd721214e5e4798b71974" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "upvote" ADD CONSTRAINT "FK_3abd9f37a94f8db3c33bda4fdae" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "upvote" ADD CONSTRAINT "FK_e7036b734e2f1e7450b3100ca3b" FOREIGN KEY ("campgroundId") REFERENCES "campground"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campground" ADD CONSTRAINT "FK_507f96f78d0d9d65785689e1c73" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campground" DROP CONSTRAINT "FK_507f96f78d0d9d65785689e1c73"`);
        await queryRunner.query(`ALTER TABLE "upvote" DROP CONSTRAINT "FK_e7036b734e2f1e7450b3100ca3b"`);
        await queryRunner.query(`ALTER TABLE "upvote" DROP CONSTRAINT "FK_3abd9f37a94f8db3c33bda4fdae"`);
        await queryRunner.query(`DROP TABLE "campground"`);
        await queryRunner.query(`DROP TABLE "upvote"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
