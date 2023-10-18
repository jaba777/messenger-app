import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Message } from "./Message"; // Assuming you have a Message entity

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
  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
