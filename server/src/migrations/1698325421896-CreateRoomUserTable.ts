import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateRoomUserTable1698325421896 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "room_user",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "has_seen",
            type: "boolean",
          },
          {
            name: "userId",
            type: "int",
          },
          {
            name: "roomId",
            type: "int",
          },
        ],
      }),
      true
    );

    // Add foreign keys to establish the relationships
    await queryRunner.createForeignKey(
      "room_user",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "room_user",
      new TableForeignKey({
        columnNames: ["roomId"],
        referencedColumnNames: ["id"],
        referencedTableName: "room",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("room_user");
    if (table) {
      await queryRunner.dropForeignKeys("room_user", table.foreignKeys);
      await queryRunner.dropTable("room_user");
    }
  }
}
