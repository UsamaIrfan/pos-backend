// Role.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ROLES } from "../utils/enums";

import { AppDataSource } from "./index";
import { User } from "./user";

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.roles)
  user: User;

  static async initializeRoles() {
    const roles = [ROLES.COMPANY_OWNER, ROLES.COMPANY_STAFF, ROLES.USER]; // Modify the roles as needed

    const roleRepository = AppDataSource.getRepository(Roles);
    const existingRoles = await roleRepository.find();

    const rolesToAdd = roles.filter(
      (role) =>
        !existingRoles.some((existingRole) => existingRole.name === role)
    );

    if (rolesToAdd.length > 0) {
      const newRoles = rolesToAdd.map((role) => {
        const newRole = new Roles();
        newRole.name = role;
        return newRole;
      });

      await roleRepository.save(newRoles);
      console.log("Roles initialized successfully");
    }
  }
}
