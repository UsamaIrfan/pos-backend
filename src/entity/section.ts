import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { BOQ } from "./boq";

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  unit: string;

  @ManyToOne(() => BOQ, (boq) => boq.sections, {
    onDelete: "CASCADE",
  })
  boq: BOQ;

  @Column()
  boqId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
