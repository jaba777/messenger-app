import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import {RoomUser} from './RoomUser'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status_id: number;

  @Column()
  company_id: number;

  @Column()
  role: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  password: string;

  // Define the relationship with the Message entity
  @OneToMany(() => RoomUser, (roomUsers) => roomUsers.user)
  rooms: RoomUser[];
}
