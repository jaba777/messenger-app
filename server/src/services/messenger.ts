import { getConnection, Repository, SelectQueryBuilder, Not } from "typeorm";
import { RoomUser } from "../entities/RoomUser";
import { Room } from "../entities/Room";
import { v4 as uuidv4 } from "uuid";
import { User } from "../entities/User";
import { Message } from "../entities/Message";
import dataSource from "../../ormconfig";

const getRoomUser = async (sender: number, receiver: number) => {
  try {
    const roomUserRepository: Repository<RoomUser> =
      dataSource.getRepository(RoomUser);
    // const roomRepository: Repository<Room> = dataSource.getRepository(Room);

    const result = await roomUserRepository
      .createQueryBuilder("roomUser")
      .leftJoinAndSelect("roomUser.room", "room")
      .leftJoinAndSelect("roomUser.user", "user")
      .where("roomUser.user.id = :receiver", { receiver: receiver })
      .andWhere((qb: SelectQueryBuilder<RoomUser>) => {
        const subQuery = qb
          .subQuery()
          .select("ru.room.id")
          .from(RoomUser, "ru")
          .where("ru.user.id = :sender", { sender: sender })
          .getQuery();

        return `roomUser.room.id IN ${subQuery}`;
      })
      .getOne();

    return result;
  } catch (error) {}
};

const createRoom = async (isConnected: boolean) => {
  try {
    const roomRepository: Repository<Room> = dataSource.getRepository(Room);
    const room = await roomRepository.save({
      uuid: uuidv4(),
      last_message_at: new Date(),
      is_blocked: false,
      blocked_by: 0,
      is_connected: isConnected || false,
    });
    return room;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

const updateRoom = async (roomId: number, isConnected: boolean) => {
  try {
    const roomRepository: Repository<Room> = dataSource.getRepository(Room);
    const roomUpdate = await roomRepository.findOne({ where: { id: roomId } });
    if (roomUpdate) {
      roomUpdate.is_connected = isConnected;
      await roomRepository.save(roomUpdate);
    } else {
      console.log("error");
    }
  } catch (error) {}
};

const createRoomUser = async (roomId: number, userId: number) => {
  try {
    const userRepository: Repository<User> = dataSource.getRepository(User);

    const roomRepository: Repository<Room> = dataSource.getRepository(Room);

    const user = await userRepository.findOne({ where: { id: userId } });
    const room = await roomRepository.findOne({ where: { id: roomId } });
    const roomUserRepository: Repository<RoomUser> =
      dataSource.getRepository(RoomUser);
    const roomUser = await roomUserRepository.save({
      room: room,
      user: user,
      has_seen: false,
    });

    return roomUser;
  } catch (error) {}
};

const getRoomByuuId = async (roomId: string, userId: number) => {
  try {
    const userRepository: Repository<User> = dataSource.getRepository(User);
    const roomRepository: Repository<Room> = dataSource.getRepository(Room);
    const findUser = await userRepository.findOne({ where: { id: userId } });
    const findRoom = await roomRepository.findOne({
      where: {
        uuid: roomId,
        roomUsers: {
          user: {
            id: Not(userId),
          },
        },
      },
      relations: ["roomUsers", "roomUsers.user"],
    });

    const roomcollect = {};
    return findRoom;
  } catch (error) {}
};

const getMessenger = async (roomId: number) => {
  try {
    const messageRepository: Repository<Message> =
      dataSource.getRepository(Message);
    const message = await messageRepository
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.room", "room")
      .where("room.id = :roomId", { roomId })
      .getMany();
    return message;
  } catch (error) {}
};

export {
  getRoomUser,
  createRoom,
  createRoomUser,
  updateRoom,
  getRoomByuuId,
  getMessenger,
};
