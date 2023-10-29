import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoomUser1698496392047 implements MigrationInterface {
  name = "CreateRoomUser1698496392047";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "room_user" (
        "id" SERIAL NOT NULL,
        "has_seen" boolean NOT NULL,
        "userId" integer,
        "roomId" integer,
        CONSTRAINT "PK_c4dcd6c85f199f44ffade712c59" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "room_user"
      ADD CONSTRAINT "FK_0cd1b74271c04e50704ef8e1aa4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "room_user"
      ADD CONSTRAINT "FK_a6697f504d5d0e00098efc61b17" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_user" DROP CONSTRAINT "FK_0cd1b74271c04e50704ef8e1aa4"`
    );
    await queryRunner.query(
      `ALTER TABLE "room_user" DROP CONSTRAINT "FK_a6697f504d5d0e00098efc61b17"`
    );
    await queryRunner.query(`DROP TABLE "room_user"`);
  }
}
