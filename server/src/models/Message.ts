import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Room } from "./Room"; 


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

  @ManyToOne(() => Room, (room) => room.messages)
  room: Room;

}
