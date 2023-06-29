import boqService from "../services/boq";

import asyncHandler from "../utils/asyncHandler";
import clean from "../utils/clean";
import { HttpException, SuccessResponse } from "../utils/response";
import boqValidators from "../utils/validation/boq";

import { AuthRequest } from "../types/request";

const createBoq = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["name", "description", "tenderId"],
  });

  const { error, value } = boqValidators.create.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const { error: boqError, boq } = await boqService.create({
    ...value,
  });
  if (boqError) {
    throw new HttpException(boqError?.message, 500);
  }
  res.status(200).send(SuccessResponse(boq));
});

const updateBoq = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["name", "description", "tenderId"],
  });
  const params = clean.request(req, { params: ["id"] });

  const { error, value } = boqValidators.update.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const updated = await boqService.update(params?.id, value);
  res.status(200).send(SuccessResponse(updated));
});

const removeBoq = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const removed = await boqService.remove(params?.id);

  if (!removed) {
    throw new HttpException("Unable to remove BOQ", 400);
  }

  res.status(200).send(SuccessResponse(removed));
});

const restoreBoq = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const restored = await boqService.restore(params?.id);

  if (!restored) {
    throw new HttpException("Unable to restore BOQ", 400);
  }

  res.status(200).send(SuccessResponse(restored));
});

const getById = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const boq = await boqService.findOne(params?.id);

  if (!boq) {
    throw new HttpException("BOQ not found", 400);
  }

  res.status(200).send(SuccessResponse(boq));
});

const get = asyncHandler(async (req, res) => {
  const query = clean.request(req, { query: ["tenderId", "companyId"] });

  const boq = await boqService.find({
    ...(query?.tenderId ? { tenderId: query?.tenderId } : {}),
    ...(query?.companyId ? { companyId: query?.companyId } : {}),
  });

  res.status(200).send(SuccessResponse(boq));
});

const getAll = asyncHandler(async (req: AuthRequest, res) => {
  const query = clean.request(req, { query: ["tenderId"] });

  const boqs = await boqService.find({
    ...(query?.tenderId ? { tenderId: query?.tenderId } : {}),
  });

  res.status(200).send(SuccessResponse(boqs));
});

const boqController = {
  createBoq,
  updateBoq,
  removeBoq,
  getById,
  get,
  getAll,
  restoreBoq,
};

export default boqController;
