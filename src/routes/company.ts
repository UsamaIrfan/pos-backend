import express from "express";

import companyController from "../controllers/company";

import authenticate from "../middlewares/auth";

import { ROLES } from "../utils/enums";

const companyRouter = express.Router();

// Create
companyRouter.post(
  "/",
  authenticate([ROLES.COMPANY_OWNER]),
  companyController.createCompany
);

// Get (Only Active)
companyRouter.get("/", authenticate(), companyController.get);

// Get (All)
companyRouter.get(
  "/all",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  companyController.getAll
);

// Get One By Id
companyRouter.get(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  companyController.getById
);

// Update One by Id
companyRouter.put(
  "/:id",
  authenticate([ROLES.COMPANY_OWNER]),
  companyController.updateCompany
);

// Soft delete One by Id
companyRouter.delete(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  companyController.removeCompany
);

// Soft delete One by Id
companyRouter.put(
  "/:id/restore",
  authenticate([ROLES.SUPER_ADMIN]),
  companyController.restoreCompany
);

export default companyRouter;
