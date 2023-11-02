import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1698653941877 implements MigrationInterface {
    name = 'CreateUser1698653941877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "room_user_id" integer NOT NULL, "room_id" integer NOT NULL, "message" character varying NOT NULL, "file" character varying NOT NULL, "roomId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "surname" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_user" ("id" SERIAL NOT NULL, "has_seen" boolean NOT NULL, "userId" integer, "roomId" integer, CONSTRAINT "PK_4bae79e46b7d9395a7ebdf86423" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "is_blocked" boolean NOT NULL, "blocked_by" integer NOT NULL, "last_message_at" TIMESTAMP NOT NULL, "is_connected" boolean NOT NULL, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_fdfe54a21d1542c564384b74d5c" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_user" ADD CONSTRAINT "FK_27dad61266db057665ee1b13d3d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_user" ADD CONSTRAINT "FK_507b03999779b22e06538595dec" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_user" DROP CONSTRAINT "FK_507b03999779b22e06538595dec"`);
        await queryRunner.query(`ALTER TABLE "room_user" DROP CONSTRAINT "FK_27dad61266db057665ee1b13d3d"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_fdfe54a21d1542c564384b74d5c"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "room_user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
