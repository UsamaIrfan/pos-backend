import orderItemService from "../services/orderItem";

import asyncHandler from "../utils/asyncHandler";
import clean from "../utils/clean";
import { HttpException, SuccessResponse } from "../utils/response";
import orderItemValidators from "../utils/validation/order";

import { AuthRequest } from "../types/request";

const createOrderItem = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["salePrice", "saleQuantity", "itemId", "orderId"],
  });

  const { error, value } = orderItemValidators.create.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const { orderItem } = await orderItemService.create({
    ...value,
  });
  res.status(200).send(SuccessResponse(orderItem));
});

const updateOrderItem = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["salePrice", "saleQuantity", "itemId"],
  });
  const params = clean.request(req, { params: ["id"] });

  const { error, value } = orderItemValidators.update.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const updated = await orderItemService.update(params?.id, value);
  res.status(200).send(SuccessResponse(updated));
});

const removeOrderItem = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const removed = await orderItemService.remove(params?.id);

  if (!removed) {
    throw new HttpException("Unable to remove order item", 400);
  }

  res.status(200).send(SuccessResponse(removed));
});

const restoreOrderItem = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const restored = await orderItemService.restore(params?.id);

  if (!restored) {
    throw new HttpException("Unable to restore order item", 400);
  }

  res.status(200).send(SuccessResponse(restored));
});

const getById = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const orderItem = await orderItemService.findOne(params?.id);

  if (!orderItem) {
    throw new HttpException("Order Item not found", 400);
  }

  res.status(200).send(SuccessResponse(orderItem));
});

const get = asyncHandler(async (_req, res) => {
  const orderItem = await orderItemService.find({});

  res.status(200).send(SuccessResponse(orderItem));
});

const getAll = asyncHandler(async (req: AuthRequest, res) => {
  const query = clean.request(req, { query: ["orderId"] });

  const orderItems = await orderItemService.find({
    ...(query?.orderId ? { orderId: query?.orderId } : {}),
  });

  res.status(200).send(SuccessResponse(orderItems));
});

const getPaginated = asyncHandler(async (req: AuthRequest, res) => {
  const query = clean.request(req, { query: ["orderId", "page", "limit"] });

  const data = await orderItemService.paginate({
    page: query?.page,
    limit: query?.limit,
    where: {
      ...(query?.orderId ? { orderId: query?.orderId } : {}),
    },
    relations: ["item"],
  });

  res.status(200).send(SuccessResponse(data));
});

const orderController = {
  createOrderItem,
  updateOrderItem,
  removeOrderItem,
  getById,
  get,
  getAll,
  restoreOrderItem,
  getPaginated,
};

export default orderController;
