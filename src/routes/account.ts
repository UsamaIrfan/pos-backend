import express from "express";

import accountController from "../controllers/account";

import authenticate from "../middlewares/auth";

import { ROLES } from "../utils/enums";

const accountRouter = express.Router();

// Create
accountRouter.post(
  "/",
  authenticate([ROLES.COMPANY_OWNER]),
  accountController.createAccount
);

// Get (Only Active)
accountRouter.get("/", authenticate(), accountController.getPaginated);

// Get (All)
accountRouter.get(
  "/all",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  accountController.getAll
);

// Get One By Id
accountRouter.get(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  accountController.getById
);

// Update One by Id
accountRouter.put(
  "/:id",
  authenticate([ROLES.COMPANY_OWNER]),
  accountController.updateAccount
);

// Soft delete One by Id
accountRouter.delete(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  accountController.removeAccount
);

// Soft delete One by Id
accountRouter.put(
  "/:id/restore",
  authenticate([ROLES.SUPER_ADMIN]),
  accountController.restoreTender
);

export default accountRouter;
