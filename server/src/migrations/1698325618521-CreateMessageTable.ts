import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateMessageTable1698325618521 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "message",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "room_user_id",
            type: "int",
          },
          {
            name: "room_id",
            type: "int",
          },
          {
            name: "message",
            type: "text",
          },
          {
            name: "file",
            type: "text",
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "message",
      new TableForeignKey({
        columnNames: ["room_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "room",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key and then the table
    const table = await queryRunner.getTable("message");
    if (table) {
      await queryRunner.dropForeignKey("message", table.foreignKeys[0]);
      await queryRunner.dropTable("message");
    }
  }
}
