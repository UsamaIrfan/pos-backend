import companyService from "../services/company";

import asyncHandler from "../utils/asyncHandler";
import clean from "../utils/clean";
import commonUtils from "../utils/common";
import { HttpException, SuccessResponse } from "../utils/response";
import companyValidators from "../utils/validation/company";

import { AuthRequest } from "../types/request";

const createCompany = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["name", "address", "phoneNumber", "otherDetails"],
  });

  const { error, value } = companyValidators.create.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const { error: companyError, company } = await companyService.create({
    ...value,
    user: req?.user?.id,
  });
  if (companyError) {
    throw new HttpException(companyError?.message, 500);
  }
  res.status(200).send(SuccessResponse(company));
});

const updateCompany = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["name", "address", "phoneNumber", "otherDetails"],
  });
  const params = clean.request(req, { params: ["id"] });

  const { error, value } = companyValidators.update.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const updated = await companyService.update(params?.id, value);
  res.status(200).send(SuccessResponse(updated));
});

const removeCompany = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const removed = await companyService.remove(params?.id);

  if (!removed) {
    throw new HttpException("Unable to remove company", 400);
  }

  res.status(200).send(SuccessResponse(removed));
});

const restoreCompany = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const restored = await companyService.restore(params?.id);

  if (!restored) {
    throw new HttpException("Unable to restore company", 400);
  }

  res.status(200).send(SuccessResponse(restored));
});

const getById = asyncHandler(async (req, res) => {
  const params = clean.request(req, { params: ["id"] });
  const company = await companyService.findOne(params?.id);

  if (!company) {
    throw new HttpException("Company not found", 400);
  }

  res.status(200).send(SuccessResponse(company));
});

const get = asyncHandler(async (_req, res) => {
  const company = await companyService.find({ isActive: true });

  res.status(200).send(SuccessResponse(company));
});

const getAll = asyncHandler(async (req: AuthRequest, res) => {
  const isCompanyOwner = commonUtils.isCompanyOwner(req);

  const company = await companyService.find({
    ...(isCompanyOwner ? { userId: req?.user?.id } : {}),
  });

  res.status(200).send(SuccessResponse(company));
});

const companyController = {
  createCompany,
  updateCompany,
  removeCompany,
  getById,
  get,
  getAll,
  restoreCompany,
};

export default companyController;
