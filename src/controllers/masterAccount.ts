import masterAccountService from "../services/masterAccount";

import asyncHandler from "../utils/asyncHandler";
import clean from "../utils/clean";
import { HttpException, SuccessResponse } from "../utils/response";
import masterAccountValidators from "../utils/validation/masterAccount";

import { AuthRequest } from "../types/request";

const createMasterAccount = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["name", "type", "companyId"],
  });

  const { error, value } = masterAccountValidators.create.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const { masterAccount } = await masterAccountService.create({
    ...value,
    createdById: req?.user?.id,
  });
  res.status(200).send(SuccessResponse(masterAccount));
});

const updateMasterAccount = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["name", "type"],
  });
  const params = clean.request(req, { params: ["id"] });

  const { error, value } = masterAccountValidators.update.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const updated = await masterAccountService.update(params?.id, value);
  res.status(200).send(SuccessResponse(updated));
});

const removeMasterAccount = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const removed = await masterAccountService.remove(params?.id);

  if (!removed) {
    throw new HttpException("Unable to remove master account", 400);
  }

  res.status(200).send(SuccessResponse(removed));
});

const restoreTender = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const restored = await masterAccountService.restore(params?.id);

  if (!restored) {
    throw new HttpException("Unable to restore master account", 400);
  }

  res.status(200).send(SuccessResponse(restored));
});

const getById = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const masterAccount = await masterAccountService.findOne(params?.id);

  if (!masterAccount) {
    throw new HttpException("Master account not found", 400);
  }

  res.status(200).send(SuccessResponse(masterAccount));
});

const get = asyncHandler(async (_req, res) => {
  const tender = await masterAccountService.find({});

  res.status(200).send(SuccessResponse(tender));
});

const getAll = asyncHandler(async (req: AuthRequest, res) => {
  const masterAccounts = await masterAccountService.find({});

  res.status(200).send(SuccessResponse(masterAccounts));
});

const getPaginated = asyncHandler(async (req: AuthRequest, res) => {
  const query = clean.request(req, { query: ["page", "limit"] });

  const data = await masterAccountService.paginate({
    page: query?.page,
    limit: query?.limit,
  });

  res.status(200).send(SuccessResponse(data));
});

const accountController = {
  createMasterAccount,
  updateMasterAccount,
  removeMasterAccount,
  getById,
  get,
  getAll,
  restoreTender,
  getPaginated,
};

export default accountController;
