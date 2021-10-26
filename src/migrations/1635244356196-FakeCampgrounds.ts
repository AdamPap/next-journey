import { MigrationInterface, QueryRunner } from "typeorm";

export class FakeCampgrounds1635244356196 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`insert into campground (name, location, "creatorId") values ('Dwight', 'Zabaykal’sk', 1);
    insert into campground (name, location, "creatorId") values ('John Wall', 'Huangjin', 1);
    insert into campground (name, location, "creatorId") values ('Delladonna', 'Anwen', 1);
    insert into campground (name, location, "creatorId") values ('Eagan', 'Madrid', 1);
    insert into campground (name, location, "creatorId") values ('American', 'Mougins', 1);
    insert into campground (name, location, "creatorId") values ('John Wall', 'Al Fayyūm', 1);
    insert into campground (name, location, "creatorId") values ('Starling', 'Xiaoguan', 1);
    insert into campground (name, location, "creatorId") values ('Fairview', 'Waigete', 1);
    insert into campground (name, location, "creatorId") values ('Lawn', 'Sennoy', 1);
    insert into campground (name, location, "creatorId") values ('Northport', 'Staten Island', 1);
    insert into campground (name, location, "creatorId") values ('Barby', 'La Gloria', 1);
    insert into campground (name, location, "creatorId") values ('Main', 'Bobigny', 1);
    insert into campground (name, location, "creatorId") values ('Truax', 'Huangtudian', 1);
    insert into campground (name, location, "creatorId") values ('Forest Dale', 'Juan L. Lacaze', 1);
    insert into campground (name, location, "creatorId") values ('Spohn', 'Vesëlyy', 1);
    insert into campground (name, location, "creatorId") values ('Golf', 'Seren', 1);
    insert into campground (name, location, "creatorId") values ('Havey', 'Oinófyta', 1);
    insert into campground (name, location, "creatorId") values ('Miller', 'Trá Mhór', 1);
    insert into campground (name, location, "creatorId") values ('Red Cloud', 'Bartsrashen', 1);
    insert into campground (name, location, "creatorId") values ('Commercial', 'Nusajaya', 1);
    insert into campground (name, location, "creatorId") values ('Esker', 'Thorpe', 1);
    insert into campground (name, location, "creatorId") values ('Amoth', 'Magadan', 1);
    insert into campground (name, location, "creatorId") values ('Bunker Hill', 'Bokaa', 1);
    insert into campground (name, location, "creatorId") values ('Golden Leaf', 'Marquard', 1);
    insert into campground (name, location, "creatorId") values ('Anniversary', 'Talawi', 1);
    insert into campground (name, location, "creatorId") values ('Paget', 'Luoping', 1);
    insert into campground (name, location, "creatorId") values ('Loomis', 'Muricay', 1);
    insert into campground (name, location, "creatorId") values ('Toban', 'Włosienica', 1);
    insert into campground (name, location, "creatorId") values ('Green Ridge', 'Mizhhir’ya', 1);
    insert into campground (name, location, "creatorId") values ('Longview', 'Tulungrejo', 1);
    insert into campground (name, location, "creatorId") values ('Loftsgordon', 'Tuanshan', 1);
    insert into campground (name, location, "creatorId") values ('Ohio', 'Ouro Branco', 1);
    insert into campground (name, location, "creatorId") values ('Dovetail', 'North Little Rock', 1);
    insert into campground (name, location, "creatorId") values ('Algoma', 'Älvsjö', 1);
    insert into campground (name, location, "creatorId") values ('Barby', 'Murillo', 1);
    insert into campground (name, location, "creatorId") values ('Bay', 'Cruzília', 1);
    insert into campground (name, location, "creatorId") values ('Schmedeman', 'Guanyinsi', 1);
    insert into campground (name, location, "creatorId") values ('Surrey', 'Kenyau', 1);
    insert into campground (name, location, "creatorId") values ('Leroy', 'Kabalo', 1);
    insert into campground (name, location, "creatorId") values ('Clove', 'Mörrum', 1);
    insert into campground (name, location, "creatorId") values ('Village', 'Zelenogorsk', 1);
    insert into campground (name, location, "creatorId") values ('Milwaukee', 'Sardasht', 1);
    insert into campground (name, location, "creatorId") values ('Spaight', 'Marseille', 1);
    insert into campground (name, location, "creatorId") values ('Kensington', 'Santa Cruz', 1);
    insert into campground (name, location, "creatorId") values ('Sunnyside', 'Il’ichëvo', 1);
    insert into campground (name, location, "creatorId") values ('Farwell', 'Sestroretsk', 1);
    insert into campground (name, location, "creatorId") values ('Macpherson', 'Nagato', 1);
    insert into campground (name, location, "creatorId") values ('Gulseth', 'Lawa-an', 1);
    insert into campground (name, location, "creatorId") values ('Lakewood Gardens', 'Shenzhong', 1);
    insert into campground (name, location, "creatorId") values ('La Follette', 'Ta’erqi', 1);
    insert into campground (name, location, "creatorId") values ('5th', 'Macapsing', 1);
    insert into campground (name, location, "creatorId") values ('Scofield', 'El Vigía', 1);
    insert into campground (name, location, "creatorId") values ('Victoria', 'Rudnyy', 1);
    insert into campground (name, location, "creatorId") values ('Nelson', 'Bulasa', 1);
    insert into campground (name, location, "creatorId") values ('5th', 'Parista', 1);
    insert into campground (name, location, "creatorId") values ('Mayer', 'Bielawa', 1);
    insert into campground (name, location, "creatorId") values ('Lakewood', 'Stockholm', 1);
    insert into campground (name, location, "creatorId") values ('Katie', 'Hongkeli', 1);
    insert into campground (name, location, "creatorId") values ('Crest Line', 'Großklein', 1);
    insert into campground (name, location, "creatorId") values ('Saint Paul', 'Gonghe', 1);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
