import sectionItemService from "../services/sectionItem";

import asyncHandler from "../utils/asyncHandler";
import clean from "../utils/clean";
import { HttpException, SuccessResponse } from "../utils/response";
import sectionItemValidators from "../utils/validation/sectionItem";

import { AuthRequest } from "../types/request";

const createSectionItem = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["name", "sectionId", "description", "quantity", "unit", "price"],
  });

  const { error, value } = sectionItemValidators.create.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const section = await sectionItemService.create({
    ...value,
  });
  res.status(200).send(SuccessResponse(section));
});

const updateSectionItem = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["name", "sectionId", "description", "quantity", "unit", "price"],
  });
  const params = clean.request(req, { params: ["id"] });

  const { error, value } = sectionItemValidators.update.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const updated = await sectionItemService.update(params?.id, value);
  res.status(200).send(SuccessResponse(updated));
});

const removeSectionItem = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const removed = await sectionItemService.remove(params?.id);

  if (!removed) {
    throw new HttpException("Unable to remove Section", 400);
  }

  res.status(200).send(SuccessResponse(removed));
});

const restoreSectionItem = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const restored = await sectionItemService.restore(params?.id);

  if (!restored) {
    throw new HttpException("Unable to restore Section", 400);
  }

  res.status(200).send(SuccessResponse(restored));
});

const getById = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const section = await sectionItemService.findOne(params?.id);

  if (!section) {
    throw new HttpException("Section not found", 400);
  }

  res.status(200).send(SuccessResponse(section));
});

const get = asyncHandler(async (req, res) => {
  const query = clean.request(req, {
    query: ["sectionId", "companyId", "tenderId", "boqId"],
  });

  const section = await sectionItemService.find({
    ...(query?.sectionId ? { sectionId: query?.sectionId } : {}),
    ...(query?.companyId ? { companyId: query?.companyId } : {}),
    ...(query?.tenderId ? { tenderId: query?.tenderId } : {}),
    ...(query?.boqId ? { boqId: query?.boqId } : {}),
  });

  res.status(200).send(SuccessResponse(section));
});

const getPaginated = asyncHandler(async (req: AuthRequest, res) => {
  const query = clean.request(req, { query: ["sectionId"] });

  const sections = await sectionItemService.paginate({
    ...(query?.sectionId ? { sectionId: query?.sectionId } : {}),
    page: query?.page,
    limit: query?.limit,
    relations: ["section"],
  });

  res.status(200).send(SuccessResponse(sections));
});

const sectionItemController = {
  createSectionItem,
  updateSectionItem,
  removeSectionItem,
  getById,
  get,
  getPaginated,
  restoreSectionItem,
};

export default sectionItemController;
