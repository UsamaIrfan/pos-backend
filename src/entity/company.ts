import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Tender } from "./tender";
import { User } from "./user";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  otherDetails?: string;

  @ManyToOne(() => User, (user) => user.company, { onDelete: "SET NULL" })
  user: User;

  @OneToMany(() => Tender, (tender) => tender.company, { onDelete: "SET NULL" })
  tenders: Tender[];

  @Column({ nullable: true })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
