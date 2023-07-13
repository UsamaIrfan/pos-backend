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

import { Company } from "./company";
import { MasterAccount } from "./masterAccount";
import { User } from "./user";

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => Company, (company) => company.tenders, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  company: Company;

  @Column()
  companyId: number;

  @ManyToOne(() => MasterAccount, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  accountType: MasterAccount;

  @Column()
  accountTypeId: number;

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
