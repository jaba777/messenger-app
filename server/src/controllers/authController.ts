import { Request, Response } from "express";
import { getConnection, Repository, ILike } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { getUserRoom } from "../helper/roomService";

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
    const userRepository: Repository<User> =
      getConnection().getRepository(User);
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

    const userRepository: Repository<User> =
      getConnection().getRepository(User);
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

    const userRepository: Repository<User> =
      getConnection().getRepository(User);
    const findUser = await userRepository.findOne({
      where: { email: decode?.email },
    });

    res.status(200).json({
      success: true,
      user: {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
      },
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
    const userRepository: Repository<User> =
      getConnection().getRepository(User);
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
    const getroomUsers = await getUserRoom(sender, receiver);
    res.status(200).send({
      success:true,
      room: getroomUsers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error In Search User API",
      error: error.message,
    });
  }
};

export { registerController, loginController, getUser, searchUsers, getRoom };
