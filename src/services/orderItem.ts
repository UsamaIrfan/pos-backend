import { FindOptionsWhere } from "typeorm";

import { Account } from "../entity/account";
import { OrderItem } from "../entity/orderItem";
import { ItemTransaction } from "../entity/transaction";
import { User } from "../entity/user";

import commonUtils from "../utils/common";
import { HttpException } from "../utils/response";

import { PaginationParams } from "../types/app";

import accountService from "./account";
import { AppDataSource, orderItemRepository } from "../entity";

const create = async (orderItemData: OrderItem & { companyId: number }) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  const user = await queryRunner.manager.findOne(User, {
    where: { id: orderItemData?.id },
    relations: ["company"],
  });
  if (!user) throw new HttpException("User not found", 404);

  const cashAccount = await accountService.getCashAccount({
    companyId: orderItemData?.companyId,
  });

  const itemAccount = await accountService.findOne(orderItemData?.itemId);
  if (itemAccount?.quantity < orderItemData?.saleQuantity) {
    throw new HttpException("Item out of stock", 400);
  }
  if (itemAccount?.price > orderItemData?.salePrice) {
    throw new HttpException(
      "Sale price cannot be less than the item price",
      400
    );
  }
  let dbOrderItem: OrderItem | null;
  let error: any;
  await queryRunner.startTransaction();
  try {
    itemAccount.quantity = itemAccount.quantity - orderItemData.saleQuantity;
    const itemTotal = +orderItemData?.salePrice * +orderItemData?.saleQuantity;
    const orderItem = queryRunner.manager.create(OrderItem, {
      ...orderItemData,
      total: itemTotal,
    });

    // Save Item Transaction to DB
    const itemTransaction = queryRunner.manager.create(ItemTransaction, {
      positive: false,
      itemId: orderItem.itemId,
      amount: itemTotal,
      quantity: +orderItemData?.saleQuantity,
    });
    await queryRunner.manager.save(ItemTransaction, itemTransaction);

    // Save Cash Transaction to DB
    const cashTransaction = queryRunner.manager.create(ItemTransaction, {
      positive: true,
      itemId: cashAccount.id,
      amount: itemTotal,
    });
    await queryRunner.manager.save(ItemTransaction, cashTransaction);

    cashAccount.price = cashAccount.price + itemTotal;

    const savedOrderItem = await queryRunner.manager.save(OrderItem, orderItem);

    // Update Sale Item Account
    await queryRunner.manager.save(Account, itemAccount);

    dbOrderItem = savedOrderItem;
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
  return { orderItem: dbOrderItem };
};

const update = async (
  id: number,
  updateItemTransaction: Partial<OrderItem>
) => {
  return await orderItemRepository.update(id, updateItemTransaction);
};

const remove = async (id: number) => {
  return await orderItemRepository.softDelete(id);
};

const restore = async (id: number) => {
  return await orderItemRepository.restore(id);
};

const findOne = async (id: number) => {
  return await orderItemRepository.findOne({
    where: { id },
    relations: ["createdBy", "item"],
  });
};

const find = async (options: FindOptionsWhere<OrderItem>) => {
  return await orderItemRepository.find({
    where: options,
    relations: ["createdBy", "item"],
  });
};

const paginate = async ({
  page,
  limit,
  ...options
}: PaginationParams<OrderItem>) => {
  return await commonUtils.paginate<OrderItem>(orderItemRepository, options, {
    page,
    limit,
  });
};

const orderItemService = {
  create,
  update,
  remove,
  restore,
  findOne,
  find,
  paginate,
};

export default orderItemService;
