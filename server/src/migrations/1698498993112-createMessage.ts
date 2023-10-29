import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class CreateMessage1698498993112 implements MigrationInterface {
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
            type: "varchar",
          },
          {
            name: "file",
            type: "varchar",
          },
        ],
      })
    );

    // Add foreign key constraint for room relationship
    await queryRunner.addColumn(
      "message",
      new TableColumn({
        name: "roomId",
        type: "int",
      })
    );
    await queryRunner.createForeignKey(
      "message",
      new TableForeignKey({
        columnNames: ["roomId"],
        referencedColumnNames: ["id"],
        referencedTableName: "room",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert the changes made in the "up" method
    await queryRunner.dropForeignKey("message", "FK_room_user_room");
    await queryRunner.dropTable("message");
  }
}
