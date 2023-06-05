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
  phoneNumber: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  password: string;

  @Column()
  isVerified: boolean;

  @Column({
    type: "enum",
    enum: ROLES,
    enumName: "roles",
    array: true,
  })
  roles: ROLES[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ErrorLog, (err) => err.user, { cascade: true })
  error_log: ErrorLog;
}
