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

import { BOQ } from "./boq";
import { SectionItem } from "./sectionItem";

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => BOQ, (boq) => boq.sections, {
    onDelete: "CASCADE",
  })
  boq: BOQ;

  @Column()
  boqId: number;

  @OneToMany(() => SectionItem, (sectionItem) => sectionItem.section, {
    onDelete: "CASCADE",
    eager: true,
  })
  sectionItems: SectionItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
