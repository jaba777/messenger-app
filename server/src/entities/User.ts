import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RoomUser } from "./RoomUser";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  password: string;

  // Define the relationship with the Message entity
  @OneToMany(() => RoomUser, (roomUser) => roomUser.user)
  roomUsers: RoomUser[];
}
