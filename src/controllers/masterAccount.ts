import masterAccountService from "../services/masterAccount";

import asyncHandler from "../utils/asyncHandler";
import clean from "../utils/clean";
import { HttpException, SuccessResponse } from "../utils/response";
import accountValidators from "../utils/validation/account";

import { AuthRequest } from "../types/request";

const createMasterAccount = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["name", "type", "companyId"],
  });

  const { error, value } = accountValidators.create.validate(body);

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

  const { error, value } = accountValidators.update.validate(body);

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
  const tender = await masterAccountService.findOne(params?.id);

  if (!tender) {
    throw new HttpException("Master account not found", 400);
  }

  res.status(200).send(SuccessResponse(tender));
});

const get = asyncHandler(async (_req, res) => {
  const tender = await masterAccountService.find({});

  res.status(200).send(SuccessResponse(tender));
});

const getAll = asyncHandler(async (req: AuthRequest, res) => {
  const query = clean.request(req, { query: ["companyId"] });

  const tenders = await masterAccountService.find({
    ...(query?.companyId ? { companyId: query?.companyId } : {}),
  });

  res.status(200).send(SuccessResponse(tenders));
});

const getPaginated = asyncHandler(async (req: AuthRequest, res) => {
  const query = clean.request(req, { query: ["companyId", "page", "limit"] });

  const data = await masterAccountService.paginate({
    page: query?.page,
    limit: query?.limit,
    where: {
      ...(query?.companyId ? { companyId: query?.companyId } : {}),
    },
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
