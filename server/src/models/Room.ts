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

  // Define the one-to-many relationship with the Message entity
  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];

  // Define the one-to-many relationship with the RoomUser entity
  @OneToMany(() => RoomUser, (roomUser) => roomUser.room)
  roomUsers: RoomUser[];

  // Define the one-to-one relationship with the Message entity for the last message
  @OneToOne(() => Message, { onDelete: "SET NULL" })
  @JoinColumn()
  lastMessage: Message;

  // Additional custom properties
  users: any; // Replace 'any' with the appropriate type
  hasSeen: boolean;
}
