import { DataSource, DataSourceOptions } from "typeorm";

const databaseConfig: DataSourceOptions = {
  name: "connection1",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "jaba123",
  database: "messenger_app",
  synchronize: false,
  logging: true,
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
};

const cliConfig = {
  entitiesDir: "src/entities",
  migrationsDir: "src/migrations",
};

const config = {
  ...databaseConfig,
  cli: cliConfig,
};
const dataSource = new DataSource(config);

export default dataSource;
