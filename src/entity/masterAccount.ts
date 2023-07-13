import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { ACCOUNT_TYPES } from "../utils/enums";

import { Company } from "./company";
import { User } from "./user";

@Entity()
export class MasterAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, enumName: "accountType", enum: ACCOUNT_TYPES })
  type: ACCOUNT_TYPES;

  @ManyToOne(() => Company, (company) => company.tenders, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  company: Company;

  @Column()
  companyId: number;

  @ManyToOne(() => User, (user) => user.tenders, { onDelete: "CASCADE" })
  @JoinColumn()
  createdBy: User;

  @Column()
  createdById: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
