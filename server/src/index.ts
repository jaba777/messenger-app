import express from "express";
import { Server } from "socket.io";
import http from "http";
import helmet from "helmet";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import redisClient from "./redis";
import cors from "cors";

dotenv.config();

const server = http.createServer(express());
const redis = redisClient.duplicate();
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const getActiveUsers = async () => {
  const users = JSON.parse(await redisClient.get("spacejobs_activeUsers"));
  return Array.isArray(users) ? users : [];
};

const setActiveUser = async (user: { id: string; userData: any }) => {
  let users = JSON.parse(await redisClient.get("spacejobs_activeUsers"));
  let find: any;

  if (users.length !== 0) {
    find = users.find((item: any) => item.userData.email === user.userData.email);
  }

  if (Array.isArray(users) && !find) {
    users.push(user);
  } else if (find) {
    const filter = users.filter(
      (item: any) => item.userData.email !== find.userData.email
    );
    users = filter;
    users.push(user);
  } else {
    users = JSON.parse(await redisClient.get("spacejobs_activeUsers"));
  }

  await redisClient.set("spacejobs_activeUsers", JSON.stringify(users));
  return users;
};

async function userJoin(id: string, userData: any) {
  const user = { id, userData };
  return await setActiveUser(user);
}

async function userLeave(socketId: string) {
  let users = await getActiveUsers();
  let actives = users.filter((user: any) => user.id !== socketId);
  await redisClient.set("spacejobs_activeUsers", JSON.stringify(actives));
  return actives;
}

redis.subscribe("spacejobs_channel");

redis.on("message", async (channel: any, resp: any) => {
  console.log("resp ", resp);
});

server.use(helmet());
server.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
server.use(bodyParser.json());

server.get("/", (req, res) => {
  res.json("hello world");
});

io.on("connection", (socket) => {
  socket.on("auth", async (authData: { user: any }) => {
    await userJoin(socket.id, authData.user);
    redisClient.publish(
      "spacejobs_channel",
      JSON.stringify({
        event: "sendActiveUsers",
      })
    );
  });

  socket.on("disconnect", async () => {
    await userLeave(socket.id);
    socket.removeAllListeners();
    redisClient.publish(
      "spacejobs_channel",
      JSON.stringify({
        event: "sendActiveUsers",
      })
    );
  });
});

server.listen(Number(process.env.PORT), () => {
  console.log("Server is running on", process.env.PORT);
});