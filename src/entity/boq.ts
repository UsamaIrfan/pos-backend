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

import { Section } from "./section";
import { Tender } from "./tender";

@Entity()
export class BOQ {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  quantity: number;

  @Column()
  unit: string;

  @ManyToOne(() => Tender, (tender) => tender.boqs, {
    onDelete: "CASCADE",
  })
  tender: Tender;

  @Column()
  tenderId: number;

  @OneToMany(() => Section, (section) => section.boq, {
    onDelete: "CASCADE",
    eager: true,
  })
  sections: Section[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
