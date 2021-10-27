import { MigrationInterface, QueryRunner } from "typeorm";

export class FakeCampgrounds1635353938611 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        insert into campground (name, location, "creatorId", "createdAt") values ('Clemons', 'Shouchun', 1, '2021-04-07T09:03:44Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Johnson', 'Kerċem', 1, '2021-04-30T02:09:29Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Kipling', 'Kakan', 1, '2020-11-13T14:19:47Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Meadow Vale', 'San Isidro', 1, '2021-09-02T08:48:35Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Porter', 'Palmerston North', 1, '2021-03-28T08:24:32Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Meadow Ridge', 'Carcassonne', 1, '2020-10-31T04:11:48Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Barby', 'Kozel’shchyna', 1, '2021-03-02T16:38:50Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Truax', 'Cayang', 1, '2021-08-15T07:15:43Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Acker', 'Serzedo', 1, '2021-08-06T23:47:17Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('1st', 'Tengah', 1, '2020-12-23T17:30:29Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Bowman', 'Quận Phú Nhuận', 1, '2020-12-04T13:54:03Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Harbort', 'Zdovbytsya', 1, '2020-11-18T20:14:53Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Esker', 'Xiaoshan', 1, '2021-01-30T05:04:31Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Mcbride', 'Guadalupe', 1, '2021-08-20T02:39:30Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Crest Line', 'Itiruçu', 1, '2021-10-07T06:27:59Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Kingsford', 'Parang', 1, '2021-05-18T17:34:39Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Nova', 'Azteca', 1, '2021-05-01T09:51:07Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Bay', 'Siqu', 1, '2020-12-07T12:24:15Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Kings', 'La Paz', 1, '2020-12-26T14:49:07Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Bonner', 'Brudzeń Duży', 1, '2021-05-04T11:36:02Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Brentwood', 'Shimodate', 1, '2021-01-26T14:25:01Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Sloan', 'Villa Nueva', 1, '2021-04-02T20:44:03Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Ludington', 'Jiatou', 1, '2020-11-01T13:59:20Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Harbort', 'Weibin', 1, '2021-09-03T11:06:25Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Forest', 'Tyringe', 1, '2020-12-18T01:28:12Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Garrison', 'El Coco', 1, '2020-11-25T01:02:58Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Johnson', 'Margasana', 1, '2021-03-24T14:47:08Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Tomscot', 'Baganga', 1, '2021-08-12T15:16:04Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Morningstar', 'Koshigaya', 1, '2021-01-21T05:16:59Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Towne', 'Fazenda de Santa Cruz', 1, '2021-03-23T10:52:23Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Westridge', 'Hamada', 1, '2021-03-25T23:09:00Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Morning', 'Shah Alam', 1, '2021-03-17T12:15:17Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Green Ridge', 'Camargo', 1, '2021-06-27T05:27:23Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Dunning', 'Agua Buena', 1, '2021-08-14T15:24:37Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Mayfield', 'Carolina', 1, '2020-11-22T20:44:28Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Bellgrove', 'Kongoussi', 1, '2021-01-20T05:20:29Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Weeping Birch', 'Zābolī', 1, '2021-07-10T07:04:43Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Caliangt', 'Rizal', 1, '2021-05-30T14:05:56Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Valley Edge', 'Jacura', 1, '2020-12-12T06:35:25Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Corry', 'Montpellier', 1, '2021-02-11T09:58:13Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Hintze', 'Santa Elena', 1, '2021-02-14T15:28:40Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Moland', 'Unidos', 1, '2021-05-15T15:44:15Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Aberg', 'Litibakul', 1, '2021-04-20T04:25:09Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Glacier Hill', 'Hongtang', 1, '2021-02-28T03:10:05Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Tennessee', 'Áno Kómi', 1, '2021-02-21T19:31:21Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Pawling', 'Chengtian', 1, '2021-01-15T23:31:14Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Transport', 'Khvatovka', 1, '2021-09-03T16:31:45Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Loftsgordon', 'Corga', 1, '2020-10-31T10:58:20Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Glacier Hill', 'Orléans', 1, '2021-06-04T07:37:43Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Ilene', 'Serra', 1, '2021-02-22T21:21:00Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Thackeray', 'Miyazu', 1, '2021-03-24T09:55:49Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Beilfuss', 'Tanenofunan', 1, '2021-01-16T03:01:42Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Carey', 'Hoeryŏng', 1, '2021-05-16T21:25:11Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Loftsgordon', 'Sumberpucung', 1, '2021-09-30T15:41:16Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Bluejay', 'Pandean', 1, '2021-06-26T14:53:08Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Lakewood Gardens', 'Senduro', 1, '2021-06-14T06:30:59Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Blackbird', 'Tshela', 1, '2021-07-04T17:18:27Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Oriole', 'Shirokovskiy', 1, '2021-07-28T18:49:41Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Fordem', 'Changpu', 1, '2021-07-18T09:31:06Z');
        insert into campground (name, location, "creatorId", "createdAt") values ('Tennessee', 'Tambac', 1, '2021-07-22T12:41:28Z');
        
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
