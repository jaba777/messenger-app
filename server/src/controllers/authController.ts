import { Request, Response } from "express";
import { getConnection, Repository, ILike, Not } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { getUserRoom, getRoomById } from "../helper/roomService";
import { Room } from "../entities/Room";
import { RoomUser } from "../entities/RoomUser";
import { Message } from "../entities/Message";
import redisClient from "../redis";
import dataSource from "../../ormconfig";

const jwtSecret: string = process.env.JWT_SECRET;

const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name) {
      res.status(400).json({ message: "Username is required" });
      return;
    }

    if (!surname) {
      res.status(400).json({ message: "surname is required" });
      return;
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      res.status(400).json({ message: "Email is invalid" });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "Password is required" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRepository: Repository<User> = dataSource.getRepository(User);

    const user = await userRepository.save({
      name,
      surname,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in Registration",
      error: error.message,
    });
  }
};

const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      res.status(400).json({ message: "Email is invalid" });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "Password is required" });
      return;
    }

    const userRepository: Repository<User> = dataSource.getRepository(User);

    const findUser = await userRepository.findOne({ where: { email } });

    if (!findUser) {
      res.status(400).json({ message: "Email is incorrect" });
      return;
    }

    const comparePass = await bcrypt.compare(password, findUser.password);
    if (!comparePass) {
      res.status(400).json({ message: "Password is incorrect" });
      return;
    }

    const token = jwt.sign(
      {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
      },
      jwtSecret,
      {
        expiresIn: "2d",
      }
    );

    res
      .cookie("token", token, { sameSite: "none", secure: true })
      .status(200)
      .json({
        success: true,
        user: {
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
        },
        token,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in Login",
      error: error.message,
    });
  }
};

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers?.authorization;
    if (!token) {
      res.status(400).json({ message: "Token is missing" });
      return;
    }

    const decode: any = jwt.verify(token, jwtSecret);
    if (!decode) {
      res.status(400).json({ message: "Something went wrong" });
      return;
    }

    const userRepository: Repository<User> = dataSource.getRepository(User);

    redisClient.get(`users:${decode?.email}`, async (error, user) => {
      if (error) console.log(error);
      if (user !== null) {
        console.log("cache hit");
        res.status(200).json({
          success: true,
          user: JSON.parse(user),
        });
        return;
      } else {
        console.log("cache miss");
        const findUser = await userRepository.findOne({
          where: { email: decode?.email },
        });
        redisClient.setex(
          `users:${decode?.email}`,
          36000,
          JSON.stringify(findUser)
        );
        res.status(200).json({
          success: true,
          user: {
            id: findUser.id,
            name: findUser.name,
            email: findUser.email,
          },
        });
        return;
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting user",
      error: error.message,
    });
  }
};

const searchUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword } = req.params;
    const userRepository: Repository<User> = dataSource.getRepository(User);

    const result = await userRepository.find({
      where: [
        { name: ILike(`%${keyword}%`) },
        { surname: ILike(`%${keyword}%`) },
      ],
      select: ["id", "name", "surname"],
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error In Search User API",
      error: error.message,
    });
  }
};

const getRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sender, receiver } = req.body;
    if (sender === receiver) {
      res.status(200).send({
        success: false,
        message: "you can't create room with yourself",
      });
      return;
    }

    const getroomUsers = await getUserRoom(sender, receiver);

    redisClient.publish("channel", JSON.stringify(getroomUsers));

    res.status(200).send({
      success: true,
      room: getroomUsers,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error In Search User API",
      error: error.message,
    });
  }
};

const getRooms = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const roomUserRepository: Repository<RoomUser> =
      dataSource.getRepository(RoomUser);

    const roomRepository: Repository<Room> = dataSource.getRepository(Room);
    const numericId = parseInt(id, 10);

    const rooms = await roomRepository
      .createQueryBuilder("room")
      .innerJoin("room.roomUsers", "roomUser")
      .innerJoin("roomUser.user", "user")
      .where("user.id = :userId", { userId: numericId })
      .getMany();
    for (const room of rooms) {
      const roomUsers = await roomUserRepository.find({
        where: {
          room: { id: room.id },
          user: Not(numericId),
        },
        relations: ["user"],
      });

      room.roomUsers = roomUsers;
    }

    const roomEvent = {
      event: "getrooms",
      rooms: rooms,
    };

    // redisClient.publish("channel", JSON.stringify(roomEvent));

    res.json({ rooms: rooms });
  } catch (error) {
    console.log(error);
  }
};

const getMessages = async (req: Request, res: Response) => {
  try {
    const { roomId, userId } = req.body;
    const room = await getRoomById(roomId, userId);
    res.json({ data: room });
  } catch (error) {}
};

const sendMessage = async (req: Request, res: Response) => {
  try {
    const { roomId, userId } = req.params;
    const { message } = req.body;
    const userRepository: Repository<User> = dataSource.getRepository(User);
    const roomRepository: Repository<Room> = dataSource.getRepository(Room);
    const messageRepository: Repository<Message> =
      dataSource.getRepository(Message);
    const userIdNum = Number(userId);
    const user = await userRepository.findOne({ where: { id: userIdNum } });
    const room = await roomRepository.findOne({ where: { uuid: roomId } });
    const createMessage = await messageRepository.save({
      message,
      room_user_id: user.id,
      room_id: room.id,
      room: room,
      file: "",
    });

    const event = {
      event: "newMessage",
      message: createMessage,
      uuid: room.uuid,
    };
    redisClient.publish("channel", JSON.stringify(event));

    res.json({ createMessage });
  } catch (error) {}
};

export {
  registerController,
  loginController,
  getUser,
  searchUsers,
  getRoom,
  getRooms,
  getMessages,
  sendMessage,
};
