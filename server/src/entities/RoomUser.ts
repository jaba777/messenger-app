import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Room } from "./Room";

@Entity()
export class RoomUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  has_seen: boolean;

  @ManyToOne(() => User, (user) => user.roomUsers)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Room, (room) => room.roomUsers)
  room: Room;
}
