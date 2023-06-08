import tenderService from "../services/tender";

import asyncHandler from "../utils/asyncHandler";
import clean from "../utils/clean";
import { HttpException, SuccessResponse } from "../utils/response";
import tenderValidators from "../utils/validation/tender";

import { AuthRequest } from "../types/request";

const createTender = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["name", "description", "companyId"],
  });

  const { error, value } = tenderValidators.create.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const { error: tenderError, tender } = await tenderService.create({
    ...value,
    createdById: req?.user?.id,
  });
  if (tenderError) {
    throw new HttpException(tenderError?.message, 500);
  }
  res.status(200).send(SuccessResponse(tender));
});

const updateTender = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["name", "description"],
  });
  const params = clean.request(req, { params: ["id"] });

  const { error, value } = tenderValidators.update.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const updated = await tenderService.update(params?.id, value);
  res.status(200).send(SuccessResponse(updated));
});

const removeTender = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const removed = await tenderService.remove(params?.id);

  if (!removed) {
    throw new HttpException("Unable to remove company", 400);
  }

  res.status(200).send(SuccessResponse(removed));
});

const restoreTender = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const restored = await tenderService.restore(params?.id);

  if (!restored) {
    throw new HttpException("Unable to restore company", 400);
  }

  res.status(200).send(SuccessResponse(restored));
});

const getById = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const tender = await tenderService.findOne(params?.id);

  if (!tender) {
    throw new HttpException("Company not found", 400);
  }

  res.status(200).send(SuccessResponse(tender));
});

const get = asyncHandler(async (_req, res) => {
  const tender = await tenderService.find({});

  res.status(200).send(SuccessResponse(tender));
});

const getAll = asyncHandler(async (req: AuthRequest, res) => {
  const query = clean.request(req, { query: ["companyId"] });

  const tenders = await tenderService.find({
    ...(query?.companyId ? { companyId: query?.companyId } : {}),
  });

  res.status(200).send(SuccessResponse(tenders));
});

const tenderController = {
  createTender,
  updateTender,
  removeTender,
  getById,
  get,
  getAll,
  restoreTender,
};

export default tenderController;
