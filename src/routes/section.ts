import express from "express";

import sectionController from "../controllers/section";

import authenticate from "../middlewares/auth";

import { ROLES } from "../utils/enums";

const sectionRouter = express.Router();

// Create
sectionRouter.post(
  "/",
  authenticate([ROLES.COMPANY_OWNER]),
  sectionController.createSection
);

// Get (Only Active)
sectionRouter.get("/", authenticate(), sectionController.get);

// Get (All)
sectionRouter.get(
  "/all",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  sectionController.getAll
);

// Get One By Id
sectionRouter.get(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  sectionController.getById
);

// Update One by Id
sectionRouter.put(
  "/:id",
  authenticate([ROLES.COMPANY_OWNER]),
  sectionController.updateSection
);

// Soft delete One by Id
sectionRouter.delete(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  sectionController.removeSection
);

// Restore One by Id
sectionRouter.put(
  "/:id/restore",
  authenticate([ROLES.SUPER_ADMIN]),
  sectionController.restoreSection
);

export default sectionRouter;
