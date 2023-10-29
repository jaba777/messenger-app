import { getConnection, Repository } from "typeorm";
import { User } from "../entities/User";
import {
  getRoomUser,
  createRoom,
  createRoomUser,
  updateRoom,
  getRoomByuuId,
  getMessenger,
} from "../services/messenger";
import { Room } from "../entities/Room";
import { RoomUser } from "../entities/RoomUser";
import dataSource from "../../ormconfig";

const getUserRoom = async (sender: number, receiver: number): Promise<any> => {
  try {
    const userRepository: Repository<User> = dataSource.getRepository(User);
    const findUser = await userRepository.findOne({
      where: { id: sender },
    });

    let getRoomUserService = await getRoomUser(findUser.id, receiver);

    let findFirst = { is: false };

    console.log("getRoomUserService", getRoomUserService);

    let room: Room;
    if (!getRoomUserService) {
      await create(sender, receiver);
      getRoomUserService = await getRoomUser(findUser.id, receiver);
      room = getRoomUserService.room;
      findFirst.is = true;
    } else {
      room = getRoomUserService.room;
      await updateRoom(room.id, true);
      findFirst.is = false;
    }

    return {
      room: room,
      user: getRoomUserService.user,
      roomId: room.uuid,
      findFirst,
    };
  } catch (error) {}
};

const create = async (sender: number, receiver: number) => {
  try {
    const room = await createRoom(false);
    await createRoomUser(room.id, sender);
    await createRoomUser(room.id, receiver);
    return room;
  } catch (error) {}
};

const getRoomById = async (roomId: string, userId: number) => {
  try {
    const room = await getRoomByuuId(roomId, userId);
    const messages = await getMessenger(room.id);
    return { room, messages, user: room.roomUsers[0].user.name };
  } catch (error) {}
};

export { getUserRoom, getRoomById };
