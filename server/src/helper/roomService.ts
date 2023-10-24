import { getConnection, Repository } from "typeorm";
import { User } from "../entities/User";
import {
  getRoomUser,
  createRoom,
  createRoomUser,
  updateRoom,
} from "../services/messenger";
import { Room } from "../entities/Room";

const getUserRoom = async (sender: number, receiver: number): Promise<Room> => {
  try {
    const userRepository: Repository<User> =
      getConnection().getRepository(User);
    const findUser = await userRepository.findOne({
      where: { id: sender },
    });

    const getRoomUserService = await getRoomUser(findUser.id, receiver);
    console.log("getRoomUserService", getRoomUserService);
    let room: Room;
    if (!getRoomUserService) {
      room = await create(sender, receiver);
      console.log("roomss", room);
    } else {
      room = getRoomUserService.room;
      await updateRoom(room.id, true);
      console.log("roomss", room);
    }

    return room;
  } catch (error) {}
};

const create = async (sender: number, receiver: number) => {
  try {
    const room = await createRoom(false);
    console.log("room", room);
    await createRoomUser(room.id, sender);
    await createRoomUser(room.id, receiver);
    return room;
  } catch (error) {}
};

export { getUserRoom };
