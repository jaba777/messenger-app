import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateRoomTable1698325536459 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "room",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "uuid",
            type: "varchar",
          },
          {
            name: "is_blocked",
            type: "boolean",
          },
          {
            name: "blocked_by",
            type: "int",
          },
          {
            name: "last_message_at",
            type: "timestamp",
          },
          {
            name: "is_connected",
            type: "boolean",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("room");
  }
}
