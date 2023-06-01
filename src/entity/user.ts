import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { ROLES } from "../utils/enums";

import { ErrorLog } from "./errorLogs";

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: "user_id" })
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: ROLES,
    enumName: "roles",
    array: true,
  })
  roles: ROLES[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(() => ErrorLog, (err) => err.user, { cascade: true })
  error_log: ErrorLog;
}
