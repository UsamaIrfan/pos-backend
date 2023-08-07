import express from "express";

import itemTransactionController from "../controllers/itemTransaction";

import authenticate from "../middlewares/auth";

import { ROLES } from "../utils/enums";

const itemTransactionRouter = express.Router();

// Create
itemTransactionRouter.post(
  "/",
  authenticate([ROLES.COMPANY_OWNER]),
  itemTransactionController.createItemTransaction
);

itemTransactionRouter.post(
  "/invest",
  authenticate([ROLES.COMPANY_OWNER]),
  itemTransactionController.createInvestmentTransaction
);

// Get (Only Active)
itemTransactionRouter.get(
  "/",
  authenticate(),
  itemTransactionController.getPaginated
);

// Get (All)
itemTransactionRouter.get(
  "/all",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  itemTransactionController.getAll
);

// Get One By Id
itemTransactionRouter.get(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  itemTransactionController.getById
);

// Update One by Id
itemTransactionRouter.put(
  "/:id",
  authenticate([ROLES.COMPANY_OWNER]),
  itemTransactionController.updateItemTransaction
);

// Soft delete One by Id
itemTransactionRouter.delete(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  itemTransactionController.removeItemTransaction
);

// Soft delete One by Id
itemTransactionRouter.put(
  "/:id/restore",
  authenticate([ROLES.SUPER_ADMIN]),
  itemTransactionController.restoreItemTransaction
);

export default itemTransactionRouter;
