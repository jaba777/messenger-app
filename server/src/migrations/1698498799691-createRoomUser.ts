import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class CreateRoomUser1698498799691 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the RoomUser table
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
        ],
      }),
      true
    );

    // Create foreign keys to establish the relationships
    await queryRunner.addColumn(
      "room_user",
      new TableColumn({
        name: "userId",
        type: "int",
      })
    );
    await queryRunner.addColumn(
      "room_user",
      new TableColumn({
        name: "roomId",
        type: "int",
      })
    );

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
    // Drop the foreign keys and the RoomUser table
    await queryRunner.dropForeignKey("room_user", "FK_room_user_user");
    await queryRunner.dropForeignKey("room_user", "FK_room_user_room");
    await queryRunner.dropTable("room_user");
  }
}
