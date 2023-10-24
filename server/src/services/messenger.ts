import { getConnection, Repository } from "typeorm";
import { RoomUser } from "../entities/RoomUser";
import { Room } from "../entities/Room";
import { v4 as uuidv4 } from "uuid";
import { User } from "../entities/User";

const getRoomUser = async (sender: number, receiver: number) => {
  try {
    const roomUserRepository: Repository<RoomUser> =
      getConnection().getRepository(RoomUser);

    const roomUser1 = await roomUserRepository.findOne({
      // where: { user_id: sender },
      // relations: ['room'], // Include the 'room' relation
    });

    return roomUser1;
  } catch (error) {}
};

const createRoom = async (isConnected: boolean) => {
  try {
    const roomRepository: Repository<Room> =
      getConnection().getRepository(Room);
    const room = await roomRepository.save({
      uuid: uuidv4(),
      last_message_at: new Date(),
      is_blocked: false, // Provide a value for is_blocked
      blocked_by: 0, // Provide a value for blocked_by
      is_connected: isConnected || false,
    });
    return room;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error; // Re-throw the error to handle it where you call createRoom
  }
};

const updateRoom = async (roomId: number, isConnected: boolean) => {
  try {
    const roomRepository: Repository<Room> =
      getConnection().getRepository(Room);
    const roomUpdate = await roomRepository.findOne({ where: { id: roomId } });
    if (roomUpdate) {
      roomUpdate.is_connected = isConnected;
      return await roomRepository.save(roomUpdate);
    } else {
      console.log("error");
    }
  } catch (error) {}
};

const createRoomUser = async (roomId: number, userId: number) => {
  try {
    const userRepository: Repository<User> =
      getConnection().getRepository(User);

    const roomRepository: Repository<Room> =
      getConnection().getRepository(Room);

    const user = await userRepository.findOne({ where: { id: userId } });
    const room = await roomRepository.findOne({ where: { id: roomId } });
    const roomUserRepository: Repository<RoomUser> =
      getConnection().getRepository(RoomUser);
    const roomUser = await roomUserRepository.save({
      room: room,
      user: user,
      has_seen: false,
    });

    return roomUser;
  } catch (error) {}
};

export { getRoomUser, createRoom, createRoomUser, updateRoom };
