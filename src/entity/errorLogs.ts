import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./user";

@Entity()
export class ErrorLog {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true, type: "text" })
  cameFrom: string;

  @Column({ nullable: true, type: "text" })
  message: string;

  @ManyToOne(() => User, (user) => user.error_log, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "user",
    referencedColumnName: "id",
  })
  user: User;
}
