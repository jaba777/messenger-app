import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User"; // Assuming you have a User entity
import { Room } from "./Room"; // Assuming you have a Room entity

@Entity()
export class RoomUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  has_seen: boolean;

  // Define the many-to-one relationship with the User entity
  @ManyToOne(() => User, (user) => user.rooms)
  user: User;

  @ManyToOne(() => Room, (room) => room.users, { eager: true })
  room: Room;
}
