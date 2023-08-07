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

import { Company } from "./company";
import { OrderItem } from "./orderItem";
import { User } from "./user";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @Column()
  subtotal: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    onDelete: "CASCADE",
  })
  orderItems: OrderItem[];

  @ManyToOne(() => Company, { onDelete: "CASCADE" })
  @JoinColumn()
  company: Company;

  @Column()
  companyId: number;

  @ManyToOne(() => User, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn()
  createdBy: User;

  @Column({ nullable: true })
  createdById: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
