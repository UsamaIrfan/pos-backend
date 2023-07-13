import { FindOptionsWhere } from "typeorm";

import { User } from "../entity/user";
import { ItemTransaction } from "src/entity/transaction";

import commonUtils from "../utils/common";
import { HttpException } from "../utils/response";

import { PaginationParams } from "../types/app";

import { AppDataSource, itemTransactionRepository } from "../entity";

const create = async (itemTransactionData: ItemTransaction) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  const user = await queryRunner.manager.findOne(User, {
    where: { id: itemTransactionData?.id },
    relations: ["company"],
  });
  if (!user) throw new HttpException("User not found", 404);

  let dbItemTransaction: ItemTransaction | null;
  let error: any;
  await queryRunner.startTransaction();
  try {
    const itemTransaction = queryRunner.manager.create(
      ItemTransaction,
      itemTransactionData
    );
    const savedAccount = await queryRunner.manager.save(
      ItemTransaction,
      itemTransaction
    );
    dbItemTransaction = savedAccount;
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
  return { itemTransaction: dbItemTransaction };
};

const update = async (
  id: number,
  updateItemTransaction: Partial<ItemTransaction>
) => {
  return await itemTransactionRepository.update(id, updateItemTransaction);
};

const remove = async (id: number) => {
  return await itemTransactionRepository.softDelete(id);
};

const restore = async (id: number) => {
  return await itemTransactionRepository.restore(id);
};

const findOne = async (id: number) => {
  return await itemTransactionRepository.findOne({
    where: { id },
    relations: ["createdBy", "item"],
  });
};

const find = async (options: FindOptionsWhere<ItemTransaction>) => {
  return await itemTransactionRepository.find({
    where: options,
    relations: ["createdBy", "item"],
  });
};

const paginate = async ({
  page,
  limit,
  ...options
}: PaginationParams<ItemTransaction>) => {
  return await commonUtils.paginate<ItemTransaction>(
    itemTransactionRepository,
    options,
    {
      page,
      limit,
    }
  );
};

const itemTransactionService = {
  create,
  update,
  remove,
  restore,
  findOne,
  find,
  paginate,
};

export default itemTransactionService;
