import express from "express";

import tenderController from "../controllers/tender";

import authenticate from "../middlewares/auth";

import { ROLES } from "../utils/enums";

const tenderRouter = express.Router();

// Create
tenderRouter.post(
  "/",
  authenticate([ROLES.COMPANY_OWNER]),
  tenderController.createTender
);

// Get (Only Active)
tenderRouter.get("/", authenticate(), tenderController.getPaginated);

// Get (All)
tenderRouter.get(
  "/all",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  tenderController.getAll
);

// Get One By Id
tenderRouter.get(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  tenderController.getById
);

// Update One by Id
tenderRouter.put(
  "/:id",
  authenticate([ROLES.COMPANY_OWNER]),
  tenderController.updateTender
);

// Soft delete One by Id
tenderRouter.delete(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  tenderController.removeTender
);

// Soft delete One by Id
tenderRouter.put(
  "/:id/restore",
  authenticate([ROLES.SUPER_ADMIN]),
  tenderController.restoreTender
);

export default tenderRouter;
