import { FindOptionsWhere } from "typeorm";

import { MasterAccount } from "../entity/masterAccount";

import commonUtils from "../utils/common";
import { HttpException } from "../utils/response";

import { PaginationParams } from "../types/app";

import { AppDataSource, masterAccountRepository } from "../entity";

const create = async (masterAccountData: Partial<MasterAccount>) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  let dbMasterAccount: MasterAccount | null;
  let error: any;
  await queryRunner.startTransaction();
  try {
    const masterAccount = queryRunner.manager.create(
      MasterAccount,
      masterAccountData
    );
    const savedTender = await queryRunner.manager.save(
      MasterAccount,
      masterAccount
    );
    dbMasterAccount = savedTender;
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
  return { masterAccount: dbMasterAccount };
};

const update = async (id: number, updateTenderObj: Partial<MasterAccount>) => {
  return await masterAccountRepository.update(id, updateTenderObj);
};

const remove = async (id: number) => {
  return await masterAccountRepository.softDelete(id);
};

const restore = async (id: number) => {
  return await masterAccountRepository.restore(id);
};

const findOne = async (id: number) => {
  return await masterAccountRepository.findOne({
    where: { id },
  });
};

const find = async (options: FindOptionsWhere<MasterAccount>) => {
  return await masterAccountRepository.find({
    where: options,
  });
};

const paginate = async ({
  page,
  limit,
  ...options
}: PaginationParams<MasterAccount>) => {
  return await commonUtils.paginate<MasterAccount>(
    masterAccountRepository,
    options,
    {
      page,
      limit,
    }
  );
};

const masterAccountService = {
  create,
  update,
  remove,
  restore,
  findOne,
  find,
  paginate,
};

export default masterAccountService;
