import express from "express";

import masterAccountController from "../controllers/masterAccount";

import authenticate from "../middlewares/auth";

import { ROLES } from "../utils/enums";

const masterAccountRouter = express.Router();

// Create
masterAccountRouter.post(
  "/",
  authenticate([ROLES.COMPANY_OWNER]),
  masterAccountController.createMasterAccount
);

// Get (Only Active)
masterAccountRouter.get(
  "/",
  authenticate(),
  masterAccountController.getPaginated
);

// Get (All)
masterAccountRouter.get(
  "/all",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  masterAccountController.getAll
);

// Get One By Id
masterAccountRouter.get(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  masterAccountController.getById
);

// Update One by Id
masterAccountRouter.put(
  "/:id",
  authenticate([ROLES.COMPANY_OWNER]),
  masterAccountController.updateMasterAccount
);

// Soft delete One by Id
masterAccountRouter.delete(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  masterAccountController.removeMasterAccount
);

// Soft delete One by Id
masterAccountRouter.put(
  "/:id/restore",
  authenticate([ROLES.SUPER_ADMIN]),
  masterAccountController.removeMasterAccount
);

export default masterAccountRouter;
