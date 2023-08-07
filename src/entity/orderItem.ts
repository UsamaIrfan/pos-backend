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
import { Order } from "./order";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @Column()
  salePrice: number;

  @Column()
  saleQuantity: number;

  @ManyToOne(() => Order, { onDelete: "CASCADE" })
  @JoinColumn()
  order: Order;

  @Column()
  orderId: number;

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
