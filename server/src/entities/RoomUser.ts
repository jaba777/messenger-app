import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn } from "typeorm";
import { User } from "./User"; // Assuming you have a User entity
import { Room } from "./Room"; // Assuming you have a Room entity

@Entity()
export class RoomUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  has_seen: boolean;

  // Define the many-to-one relationship with the User entity
  @ManyToOne(() => User, (user) => user.roomUsers) // Assuming you have a "roomUsers" property in the User entity
  @JoinColumn({ name: "userId" }) // Use @JoinColumn to specify the foreign key column
  user: User;

  @ManyToOne(() => Room, (room) => room.roomUsers)
  room: Room;
}
