import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateRoom1698498698046 implements MigrationInterface {
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

    // Add any additional operations for constraints, indexes, or foreign keys as needed.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("room");
  }
}
