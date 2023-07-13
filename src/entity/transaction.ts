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

import { Account } from "./account";
import { User } from "./user";

@Entity()
export class ItemTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  salePrice: number;

  @Column()
  saleQuantity: number;

  @ManyToOne(() => User, (user) => user.tenders, { onDelete: "CASCADE" })
  @JoinColumn()
  createdBy: User;

  @Column()
  createdById: number;

  @ManyToOne(() => Account, { onDelete: "CASCADE" })
  @JoinColumn()
  item: Account;

  @Column()
  itemId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
