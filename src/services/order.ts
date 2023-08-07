import { FindOptionsWhere } from "typeorm";

import { Account } from "../entity/account";
import { Order } from "../entity/order";
import { OrderItem } from "../entity/orderItem";
import { User } from "../entity/user";

import commonUtils from "../utils/common";
import { HttpException } from "../utils/response";

import { PaginationParams } from "../types/app";

import accountService from "./account";
import orderItemService from "./orderItem";
import { AppDataSource, orderRepository } from "../entity";

interface OrderData extends Order {
  orderItems: (OrderItem & { price: number })[];
}

const create = async (orderData: OrderData) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  const user = await queryRunner.manager.findOne(User, {
    where: { id: orderData?.id },
  });
  if (!user) throw new HttpException("User not found", 404);

  const cashAccount = await accountService.getCashAccount({
    companyId: orderData?.companyId,
  });
  let dbOrder: Order | null;
  let error: any;
  await queryRunner.startTransaction();
  try {
    // Calculate order sale total
    const total = orderData?.orderItems?.reduce(
      (acc, curr) => acc + curr?.salePrice * curr?.saleQuantity,
      0
    );

    // Calculate order COGS total
    const cogsTotal = orderData?.orderItems?.reduce(
      (acc, curr) => acc + curr?.price * curr?.saleQuantity,
      0
    );

    // Create the order
    const order = queryRunner.manager.create(Order, {
      ...orderData,
      total,
      subtotal: total,
    });
    const savedOrderItem = await queryRunner.manager.save(Order, order);
    dbOrder = savedOrderItem;

    // Create the order items for all items in the order
    orderData?.orderItems?.forEach(async (item) => {
      await orderItemService.create({
        ...item,
        orderId: savedOrderItem?.id,
        companyId: orderData?.companyId,
      });
    });

    cashAccount.price = cashAccount.price + cogsTotal;

    // Update Sale Item Account
    await queryRunner.manager.save(Account, cashAccount);

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
  return { order: dbOrder };
};

const update = async (id: number, updateItemTransaction: Partial<Order>) => {
  return await orderRepository.update(id, updateItemTransaction);
};

const remove = async (id: number) => {
  return await orderRepository.softDelete(id);
};

const restore = async (id: number) => {
  return await orderRepository.restore(id);
};

const findOne = async (id: number) => {
  return await orderRepository.findOne({
    where: { id },
    relations: ["createdBy", "orderItems"],
  });
};

const find = async (options: FindOptionsWhere<Order>) => {
  return await orderRepository.find({
    where: options,
    relations: ["createdBy", "orderItems"],
  });
};

const paginate = async ({
  page,
  limit,
  ...options
}: PaginationParams<Order>) => {
  return await commonUtils.paginate<Order>(orderRepository, options, {
    page,
    limit,
  });
};

const orderService = {
  create,
  update,
  remove,
  restore,
  findOne,
  find,
  paginate,
};

export default orderService;
