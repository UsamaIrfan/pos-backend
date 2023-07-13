import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { ROLES } from "../utils/enums";

import { Account } from "./account";
import { Company } from "./company";
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

  @OneToMany(() => Company, (company) => company.user, {
    onDelete: "SET NULL",
    nullable: true,
  })
  company: Company[];

  @OneToMany(() => Account, (tender) => tender.createdBy, {
    onDelete: "SET NULL",
    nullable: true,
  })
  tenders: Account[];

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

  @DeleteDateColumn()
  deletedAt: Date;
}
