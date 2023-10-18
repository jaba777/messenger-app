import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User"; // Assuming you have a User entity
import { Room } from "./Room"; // Assuming you have a Room entity
import { Message } from "./Message";

@Entity()
export class RoomUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room_id: number;

  @Column()
  user_id: number;

  @Column()
  has_seen: boolean;

  // Define the many-to-one relationship with the User entity
  @ManyToOne(() => User, (user) => user.roomUsers)
  user: User;

  @OneToMany(() => Message, (message) => message.roomUser)
  messages: Message[];

  // Define the many-to-one relationship with the Room entity
  @ManyToOne(() => Room, (room) => room.roomUsers)
  room: Room;
}
