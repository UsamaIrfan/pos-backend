import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { ITEM_TYPES } from "../utils/enums";

import { Company } from "./company";
import { MasterAccount } from "./masterAccount";
import { ItemTransaction } from "./transaction";

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ enumName: "itemType", enum: ITEM_TYPES })
  itemType: ITEM_TYPES;

  @ManyToOne(() => Company, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  company: Company;

  @Column()
  companyId: number;

  @Column({ nullable: true })
  isCurrent: boolean;

  @ManyToOne(() => MasterAccount, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  accountType: MasterAccount;

  @Column()
  accountTypeId: number;

  @Column()
  price: number;

  @Column({ nullable: true })
  salePrice: number;

  @Column({ nullable: true })
  quantity: number;

  @OneToMany(() => ItemTransaction, (transaction) => transaction.item, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  transactions: ItemTransaction[];

  @Column({ default: false })
  cashAccount: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
