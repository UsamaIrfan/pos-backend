import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class EmailOtp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  token: string;

  @Column("boolean", { default: false })
  verified: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
