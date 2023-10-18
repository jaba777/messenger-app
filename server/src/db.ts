import { createConnection } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const connect = createConnection({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USERNAME, // Add this line
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  synchronize: true,
});

export default connect;
