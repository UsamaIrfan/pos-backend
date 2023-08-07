import accountService from "../services/account";

import asyncHandler from "../utils/asyncHandler";
import clean from "../utils/clean";
import { HttpException, SuccessResponse } from "../utils/response";
import accountValidators from "../utils/validation/account";

import { AuthRequest } from "../types/request";

const createAccount = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: [
      "title",
      "description",
      "isCurrent",
      "itemType",
      "accountTypeId",
      "companyId",
      "price",
      "salePrice",
      "quantity",
    ],
  });

  const { error, value } = accountValidators.create.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const { account } = await accountService.create({
    ...value,
    createdById: req?.user?.id,
  });
  res.status(200).send(SuccessResponse(account));
});

const updateAccount = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: [
      "title",
      "description",
      "isCurrent",
      "accountTypeId",
      "itemType",
      "price",
      "salePrice",
      "quantity",
    ],
  });
  const params = clean.request(req, { params: ["id"] });

  const { error, value } = accountValidators.update.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const updated = await accountService.update(params?.id, value);
  res.status(200).send(SuccessResponse(updated));
});

const removeAccount = asyncHandler(async (req: AuthRequest, res) => {
  const params = clean.request(req, { params: ["id"] });
  const body = clean.request(req, { body: ["companyId"] });

  if (!body?.companyId) throw new HttpException("Company ID is required", 400);

  const removed = await accountService.remove({
    id: params?.id,
    companyId: body?.companyId,
  });

  if (!removed) {
    throw new HttpException("Unable to remove company", 400);
  }

  res.status(200).send(SuccessResponse(removed));
});

const restoreAccount = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const restored = await accountService.restore(params?.id);

  if (!restored) {
    throw new HttpException("Unable to restore company", 400);
  }

  res.status(200).send(SuccessResponse(restored));
});

const getById = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const tender = await accountService.findOne(params?.id);

  if (!tender) {
    throw new HttpException("Company not found", 400);
  }

  res.status(200).send(SuccessResponse(tender));
});

const get = asyncHandler(async (req, res) => {
  const query = clean.request(req, {
    query: ["companyId", "title", "accountTypeId"],
  });

  const tender = await accountService.find({
    ...(query?.companyId ? { companyId: query?.companyId } : {}),
    ...(query?.accountTypeId ? { accountTypeId: query?.accountTypeId } : {}),
    ...(query?.title ? { title: query?.title } : {}),
  });

  res.status(200).send(SuccessResponse(tender));
});

const getAll = asyncHandler(async (req: AuthRequest, res) => {
  const query = clean.request(req, {
    query: ["companyId", "accountTypeId", "title"],
  });

  const tenders = await accountService.find({
    ...(query?.companyId ? { companyId: query?.companyId } : {}),
    ...(query?.accountTypeId ? { accountTypeId: query?.accountTypeId } : {}),
    ...(query?.title ? { title: query?.title } : {}),
  });

  res.status(200).send(SuccessResponse(tenders));
});

const getPaginated = asyncHandler(async (req: AuthRequest, res) => {
  const query = clean.request(req, {
    query: ["companyId", "accountTypeId", "page", "limit"],
  });

  const data = await accountService.paginate({
    page: query?.page,
    limit: query?.limit,
    where: {
      ...(query?.companyId ? { companyId: query?.companyId } : {}),
      ...(query?.accountTypeId ? { accountTypeId: query?.accountTypeId } : {}),
    },
    relations: ["accountType"],
  });

  res.status(200).send(SuccessResponse(data));
});

const accountController = {
  createAccount,
  updateAccount,
  removeAccount,
  getById,
  get,
  getAll,
  restoreTender: restoreAccount,
  getPaginated,
};

export default accountController;
