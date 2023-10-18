import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { RoomUser } from "./RoomUser"; // Assuming you have a RoomUser entity
import { Room } from "./Room"; // Assuming you have a Room entity
import { User } from "./User";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room_user_id: number;

  @Column()
  room_id: number;

  @Column()
  message: string;

  @Column()
  file: string;

  // Define the relationship with the RoomUser entity
  @ManyToOne(() => RoomUser, (roomUser) => roomUser.messages)
  @JoinColumn({ name: "room_user_id" })
  roomUser: RoomUser;

  @ManyToOne(() => Room, (room) => room.messages)
  @JoinColumn({ name: "room_id" })
  room: Room;

  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  // Additional custom property
  isMine: boolean;
}
