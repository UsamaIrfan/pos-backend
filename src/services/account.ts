import { FindOptionsWhere } from "typeorm";

import { Account } from "../entity/account";
import { User } from "../entity/user";

import commonUtils from "../utils/common";
import { HttpException } from "../utils/response";

import { PaginationParams } from "../types/app";

import { accountRepository, AppDataSource } from "../entity";

const create = async (accountData: Account) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  const user = await queryRunner.manager.findOne(User, {
    where: { id: accountData?.id },
    relations: ["company"],
  });
  if (!user) throw new HttpException("User not found", 404);

  let dbAccount: Account | null;
  let error: any;
  await queryRunner.startTransaction();
  try {
    const company = queryRunner.manager.create(Account, accountData);
    const savedAccount = await queryRunner.manager.save(Account, company);
    dbAccount = savedAccount;
    await queryRunner.commitTransaction();
  } catch (err) {
    error = err;
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
  if (error) {
    throw new HttpException(error?.message, 500);
  }
  return { account: dbAccount };
};

const update = async (id: number, updateAccountObj: Partial<Account>) => {
  return await accountRepository.update(id, updateAccountObj);
};

const remove = async (id: number) => {
  return await accountRepository.softDelete(id);
};

const restore = async (id: number) => {
  return await accountRepository.restore(id);
};

const findOne = async (id: number) => {
  return await accountRepository.findOne({
    where: { id },
    relations: ["createdBy", "company", "boqs"],
  });
};

const find = async (options: FindOptionsWhere<Account>) => {
  return await accountRepository.find({
    where: options,
    relations: ["createdBy", "company"],
  });
};

const paginate = async ({
  page,
  limit,
  ...options
}: PaginationParams<Account>) => {
  return await commonUtils.paginate<Account>(accountRepository, options, {
    page,
    limit,
  });
};

const accountService = {
  create,
  update,
  remove,
  restore,
  findOne,
  find,
  paginate,
};

export default accountService;
