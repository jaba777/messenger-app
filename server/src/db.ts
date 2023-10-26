import { createConnection } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entities/User";
import { RoomUser } from "./entities/RoomUser";
import { Room } from "./entities/Room";
import { Message } from "./entities/Message";

dotenv.config();

const connect = createConnection({
  name: "myDatabase",
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  synchronize: false,
  entities: [User, RoomUser, Room, Message],
  migrations: ["src/migrations/*.ts"],
});

export default connect;
