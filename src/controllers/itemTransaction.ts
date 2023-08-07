import itemTransactionService from "../services/itemTransaction";

import asyncHandler from "../utils/asyncHandler";
import clean from "../utils/clean";
import { HttpException, SuccessResponse } from "../utils/response";
import itemTransactionValidators from "../utils/validation/itemTransaction";

import { AuthRequest } from "../types/request";

const createInvestmentTransaction = asyncHandler(
  async (req: AuthRequest, res) => {
    const body = clean.request(req, {
      body: ["amount", "itemId", "companyId"],
    });

    const { error, value } = itemTransactionValidators.create.validate(body);

    if (error) {
      throw new HttpException(error.message, 400);
    }

    const { itemTransaction } =
      await itemTransactionService.createInvestmentTransaction({
        ...value,
        createdById: req?.user?.id,
      });
    res.status(200).send(SuccessResponse(itemTransaction));
  }
);

const createItemTransaction = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["amount", "quantity", "itemId", "companyId"],
  });

  const { error, value } = itemTransactionValidators.create.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const { itemTransaction } = await itemTransactionService.create({
    ...value,
    createdById: req?.user?.id,
  });
  res.status(200).send(SuccessResponse(itemTransaction));
});

const updateItemTransaction = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["salePrice", "saleQuantity", "itemId"],
  });
  const params = clean.request(req, { params: ["id"] });

  const { error, value } = itemTransactionValidators.update.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const updated = await itemTransactionService.update(params?.id, value);
  res.status(200).send(SuccessResponse(updated));
});

const removeItemTransaction = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const removed = await itemTransactionService.remove(params?.id);

  if (!removed) {
    throw new HttpException("Unable to remove master account", 400);
  }

  res.status(200).send(SuccessResponse(removed));
});

const restoreItemTransaction = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const restored = await itemTransactionService.restore(params?.id);

  if (!restored) {
    throw new HttpException("Unable to restore master account", 400);
  }

  res.status(200).send(SuccessResponse(restored));
});

const getById = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const tender = await itemTransactionService.findOne(params?.id);

  if (!tender) {
    throw new HttpException("Master account not found", 400);
  }

  res.status(200).send(SuccessResponse(tender));
});

const get = asyncHandler(async (_req, res) => {
  const tender = await itemTransactionService.find({});

  res.status(200).send(SuccessResponse(tender));
});

const getAll = asyncHandler(async (req: AuthRequest, res) => {
  const query = clean.request(req, { query: ["itemId"] });

  const tenders = await itemTransactionService.find({
    ...(query?.itemId ? { itemId: query?.itemId } : {}),
  });

  res.status(200).send(SuccessResponse(tenders));
});

const getPaginated = asyncHandler(async (req: AuthRequest, res) => {
  const query = clean.request(req, { query: ["itemId", "page", "limit"] });

  const data = await itemTransactionService.paginate({
    page: query?.page,
    limit: query?.limit,
    where: {
      ...(query?.itemId ? { itemId: query?.itemId } : {}),
    },
  });

  res.status(200).send(SuccessResponse(data));
});

const accountController = {
  createItemTransaction,
  createInvestmentTransaction,
  updateItemTransaction,
  removeItemTransaction,
  getById,
  get,
  getAll,
  restoreItemTransaction,
  getPaginated,
};

export default accountController;
