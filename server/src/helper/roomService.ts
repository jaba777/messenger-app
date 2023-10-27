import { getConnection, Repository } from "typeorm";
import { User } from "../entities/User";
import {
  getRoomUser,
  createRoom,
  createRoomUser,
  updateRoom,
} from "../services/messenger";
import { Room } from "../entities/Room";
import { RoomUser } from "../entities/RoomUser";

const getUserRoom = async (sender: number, receiver: number): Promise<any> => {
  try {
    const userRepository: Repository<User> =
      getConnection().getRepository(User);
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

export { getUserRoom };
