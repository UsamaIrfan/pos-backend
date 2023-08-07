import orderService from "../services/order";

import asyncHandler from "../utils/asyncHandler";
import clean from "../utils/clean";
import { HttpException, SuccessResponse } from "../utils/response";
import orderItemValidators from "../utils/validation/order";

import { AuthRequest } from "../types/request";

const createOrder = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["orderItems", "companyId"],
  });

  const { error, value } = orderItemValidators.create.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const { order } = await orderService.create({
    ...value,
    createdById: req?.user?.id,
  });
  res.status(200).send(SuccessResponse(order));
});

const updateOrder = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["orderItems"],
  });
  const params = clean.request(req, { params: ["id"] });

  const { error, value } = orderItemValidators.update.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const updated = await orderService.update(params?.id, value);
  res.status(200).send(SuccessResponse(updated));
});

const removeOrder = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const removed = await orderService.remove(params?.id);

  if (!removed) {
    throw new HttpException("Unable to remove order", 400);
  }

  res.status(200).send(SuccessResponse(removed));
});

const restoreOrder = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const restored = await orderService.restore(params?.id);

  if (!restored) {
    throw new HttpException("Unable to restore order", 400);
  }

  res.status(200).send(SuccessResponse(restored));
});

const getById = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const tender = await orderService.findOne(params?.id);

  if (!tender) {
    throw new HttpException("Order not found", 400);
  }

  res.status(200).send(SuccessResponse(tender));
});

const get = asyncHandler(async (_req, res) => {
  const tender = await orderService.find({});

  res.status(200).send(SuccessResponse(tender));
});

const getAll = asyncHandler(async (req: AuthRequest, res) => {
  const query = clean.request(req, { query: ["companyId"] });

  const tenders = await orderService.find({
    ...(query?.companyId ? { companyId: query?.companyId } : {}),
  });

  res.status(200).send(SuccessResponse(tenders));
});

const getPaginated = asyncHandler(async (req: AuthRequest, res) => {
  const query = clean.request(req, { query: ["companyId", "page", "limit"] });

  const data = await orderService.paginate({
    page: query?.page,
    limit: query?.limit,
    where: {
      ...(query?.companyId ? { companyId: query?.companyId } : {}),
    },
    relations: ["orderItems", "createdBy"],
  });

  res.status(200).send(SuccessResponse(data));
});

const orderController = {
  createOrder,
  updateOrder,
  removeOrder,
  getById,
  get,
  getAll,
  restoreOrder,
  getPaginated,
};

export default orderController;
