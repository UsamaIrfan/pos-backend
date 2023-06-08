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

import { BOQ } from "./boq";
import { Company } from "./company";
import { User } from "./user";

@Entity()
export class Tender {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Company, (company) => company.tenders, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  company: Company;

  @Column()
  companyId: number;

  @OneToMany(() => BOQ, (boq) => boq.tender, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  boqs: BOQ[];

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
