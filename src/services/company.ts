import { FindOptionsWhere } from "typeorm";

import { Company } from "../entity/company";
import { User } from "../entity/user";

import { HttpException } from "./../utils/response";

import { AppDataSource, companyRepository } from "../entity";

const create = async (companyData: Company) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  const user = await queryRunner.manager.findOne(User, {
    where: { id: companyData?.userId },
    relations: ["company"],
  });
  if (!user) throw new HttpException("User not found", 404);

  if (user?.company?.[0]?.id) {
    throw new HttpException("Can only have one company at a time", 409);
  }
  let dbUser: User | null;
  let error: any;
  await queryRunner.startTransaction();
  try {
    const company = queryRunner.manager.create(Company, companyData);
    await queryRunner.manager.save(Company, company);
    const user = await queryRunner.manager.findOne(User, {
      where: { id: companyData?.userId },
      relations: ["company"],
    });
    dbUser = user;
    await queryRunner.commitTransaction();
  } catch (err) {
    error = err;
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
  return { error, user: dbUser };
};

const update = async (id: number, updateCompanyObj: Partial<Company>) => {
  return await companyRepository.update(id, updateCompanyObj);
};

const remove = async (id: number) => {
  return await companyRepository.softDelete(id);
};

const restore = async (id: number) => {
  return await companyRepository.restore(id);
};

const findOne = async (id: number) => {
  return await companyRepository.findOne({
    where: { id },
    relations: ["user"],
  });
};

const find = async (options: FindOptionsWhere<Company>) => {
  return await companyRepository.find({
    where: options,
    relations: ["user"],
  });
};

const companyService = {
  create,
  update,
  remove,
  restore,
  findOne,
  find,
};

export default companyService;
