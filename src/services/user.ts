import * as bcrypt from "bcryptjs";

import { User } from "../entity/user";

import { ROLES } from "../utils/enums";
import { HttpException } from "../utils/response";

import { userRepository } from "../entity";

const create = async (createUserDto: User) => {
  const exists = await userRepository.findOne({
    where: [
      { username: createUserDto.username },
      { email: createUserDto.email },
    ],
  });
  if (exists && exists.isVerified) {
    const message =
      exists.email === createUserDto.email
        ? "Email already taken"
        : "Username already taken";
    throw new HttpException(message, 409);
  }
  let user: User | null = null;
  const password = await bcrypt.hash(createUserDto.password, 10);
  if (exists) {
    user = await userRepository.save({
      ...exists,
      ...createUserDto,
      password,
    });
  } else {
    user = userRepository.create({
      ...createUserDto,
      roles: createUserDto.roles ?? [ROLES.USER],
      password,
    });
  }
  return await userRepository.save(user);
};

const findAll = async () => {
  // return await paginate(userRepository, { page, limit });
};

const findOne = async (id: number) => {
  return await userRepository.findOneBy({ id });
};

const findByEmail = async (email: string) => {
  return await userRepository.findOneBy({ email });
};

const findByEmailOrUsername = async (
  usernameOrEmail: string,
  checkVerified?: boolean
) => {
  return await userRepository.findOne({
    where: [
      {
        username: usernameOrEmail,
        ...(checkVerified ? { isVerified: true } : {}),
      },
      {
        email: usernameOrEmail,
        ...(checkVerified ? { isVerified: true } : {}),
      },
    ],
  });
};

const update = async (id: number, updateUserDto: any) => {
  return await userRepository.update(id, updateUserDto);
};

const updateByEmail = async (email: string, updateUserDto: any) => {
  let user = await userRepository.findOneBy({ email });
  user = { ...user, ...updateUserDto };
  return await userRepository.save(user);
};

const remove = async (id: number) => {
  return await userRepository.softDelete(id);
};

const currentUser = async (id: number) => {
  return await userRepository.findOneBy({ id });
};

const userService = {
  create,
  findAll,
  findOne,
  findByEmail,
  findByEmailOrUsername,
  update,
  updateByEmail,
  remove,
  currentUser,
};

export default userService;
