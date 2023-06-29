import sectionService from "../services/section";

import asyncHandler from "../utils/asyncHandler";
import clean from "../utils/clean";
import { HttpException, SuccessResponse } from "../utils/response";
import sectionValidators from "../utils/validation/section";

import { AuthRequest } from "../types/request";

const createSection = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["name", "boqId"],
  });

  const { error, value } = sectionValidators.create.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const section = await sectionService.create({
    ...value,
  });
  res.status(200).send(SuccessResponse(section));
});

const updateSection = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["name", "boqId"],
  });
  const params = clean.request(req, { params: ["id"] });

  const { error, value } = sectionValidators.update.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const updated = await sectionService.update(params?.id, value);
  res.status(200).send(SuccessResponse(updated));
});

const removeSection = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const removed = await sectionService.remove(params?.id);

  if (!removed) {
    throw new HttpException("Unable to remove Section", 400);
  }

  res.status(200).send(SuccessResponse(removed));
});

const restoreSection = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const restored = await sectionService.restore(params?.id);

  if (!restored) {
    throw new HttpException("Unable to restore Section", 400);
  }

  res.status(200).send(SuccessResponse(restored));
});

const getById = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const section = await sectionService.findOne(params?.id);

  if (!section) {
    throw new HttpException("Section not found", 400);
  }

  res.status(200).send(SuccessResponse(section));
});

const get = asyncHandler(async (req, res) => {
  const query = clean.request(req, { query: ["boqId", "companyId"] });

  const section = await sectionService.find({
    ...(query?.boqId ? { boqId: query?.boqId } : {}),
    ...(query?.companyId ? { companyId: query?.companyId } : {}),
  });

  res.status(200).send(SuccessResponse(section));
});

const getAll = asyncHandler(async (req: AuthRequest, res) => {
  const query = clean.request(req, { query: ["boqId"] });

  const sections = await sectionService.find({
    ...(query?.boqId ? { boqId: query?.boqId } : {}),
  });

  res.status(200).send(SuccessResponse(sections));
});

const sectionController = {
  createSection,
  updateSection,
  removeSection,
  getById,
  get,
  getAll,
  restoreSection,
};

export default sectionController;
