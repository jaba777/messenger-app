import express, { Application, Request, Response } from "express";
import { Server } from "socket.io";
import http from "http";
import helmet from "helmet";

import bodyParser from "body-parser";
import dotenv from "dotenv";
import redisClient from "./redis";
import cors from "cors";
//import connect from "./db";
import authRoutes from "./routes/authRoutes";
import dataSource from "../ormconfig";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);
const redis = redisClient.duplicate();
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const getActiveUsers = async () => {
  const users = JSON.parse(await redisClient.get("activeUsers"));
  return Array.isArray(users) ? users : [];
};

// connect
//   .then((connection) => {
//     console.log("Connected to the database");
//     // Your code here
//   })
//   .catch((error) => {
//     console.error("Error connecting to the database:", error);
//   });

async function connectToDatabase() {
  try {
    await dataSource.connect();
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

connectToDatabase();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.json("hello world");
});

app.use("/auth", authRoutes);

redis.subscribe("channel");

redis.on("message", async (channel, resp: any) => {
  try {
    const parsedResp = JSON.parse(resp);
    if (parsedResp.event == "newMessage") {
      io.to(parsedResp.uuid).emit("sendMessage", parsedResp.message);
    }
  } catch (error) {}
});

io.on("connection", (socket) => {
  socket.on("auth", async (authData: { user: any }) => {
    await userJoin(socket.id, authData.user);
    redisClient.publish(
      "channel",
      JSON.stringify({
        event: "sendActiveUsers",
      })
    );
  });

  socket.on("joinRoom", async (uuid: string) => {
    socket.join(uuid);
  });

  socket.on("disconnect", async () => {
    await userLeave(socket.id);
    socket.removeAllListeners();
    redisClient.publish(
      "channel",
      JSON.stringify({
        event: "sendActiveUsers",
      })
    );
  });
});

async function userJoin(id: string, userData: any) {
  const user = { id, userData };
  return await setActiveUser(user);
}

async function userLeave(socketId: string) {
  let users = await getActiveUsers();
  let actives = users.filter((user: any) => user.id !== socketId);
  await redisClient.set("activeUsers", JSON.stringify(actives));
  io.emit("auth", actives);
}

const setActiveUser = async (user: { id: string; userData: any }) => {
  let users = JSON.parse(await redisClient.get("activeUsers"));
  let find: any;

  if (users && users.length !== 0 && user.userData) {
    find = users.find(
      (item: any) =>
        item.userData && item.userData.email === user.userData.email
    );
  }
  if (Array.isArray(users) && !find && user.userData) {
    users.push(user);
  } else if (find) {
    const filter = users.filter(
      (item: any) =>
        item.userData && item.userData.email !== user.userData.email
    );
    users = filter;
    users.push(user);
  } else {
    users = JSON.parse(await redisClient.get("activeUsers")) || [];
  }

  await redisClient.set("activeUsers", JSON.stringify(users));
  io.emit("auth", users);
  return users;
};

server.listen(Number(process.env.PORT), () => {
  console.log("Server is running on", process.env.PORT);
});
