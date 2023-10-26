import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUser1698325693263 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "email",
            type: "varchar",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "surname",
            type: "varchar",
          },
          {
            name: "password",
            type: "varchar",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user");
  }
}