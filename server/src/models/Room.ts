import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Message } from "./Message"; // Assuming you have a Message entity
import { RoomUser } from "./RoomUser"; // Assuming you have a RoomUser entity

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  is_blocked: boolean;

  @Column()
  blocked_by: number;

  @Column()
  last_message_at: Date;

  @Column()
  is_connected: boolean;

  @OneToMany(() => RoomUser, (roomUsers) => roomUsers.room)
  users: RoomUser[];

  @OneToMany(() => Message, (messenger) => messenger.room)
  messages: Message[];

}
