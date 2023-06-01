import { ROLES } from "../utils/enums";
import { HttpException } from "../utils/response";

import { userRepository } from "../entity";

const create = async (createUserDto: any) => {
  const exists = await userRepository.findOne({
    where: [
      { username: createUserDto.username },
      { email: createUserDto.email },
    ],
  });
  if (exists) {
    const message =
      exists.email === createUserDto.email
        ? "Email already taken"
        : "Username already taken";
    throw new HttpException(message, 409);
  }
  const user = userRepository.create({
    ...createUserDto,
    roles: createUserDto.role ?? [ROLES.USER],
  });
  //   const hashed = await bcrypt.hash(user.password, 10);
  //   user.password = hashed;
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
  update,
  updateByEmail,
  remove,
  currentUser,
};

export default userService;
