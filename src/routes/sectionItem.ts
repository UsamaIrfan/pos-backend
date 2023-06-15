import express from "express";

import sectionItemController from "../controllers/sectionItem";

import authenticate from "../middlewares/auth";

import { ROLES } from "../utils/enums";

const sectionItemRouter = express.Router();

// Create
sectionItemRouter.post(
  "/",
  authenticate([ROLES.COMPANY_OWNER]),
  sectionItemController.createSectionItem
);

// Get (Only Active)
sectionItemRouter.get("/", authenticate(), sectionItemController.get);

// Get (All)
sectionItemRouter.get(
  "/paginate",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  sectionItemController.getPaginated
);

// Get One By Id
sectionItemRouter.get(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  sectionItemController.getById
);

// Update One by Id
sectionItemRouter.put(
  "/:id",
  authenticate([ROLES.COMPANY_OWNER]),
  sectionItemController.updateSectionItem
);

// Soft delete One by Id
sectionItemRouter.delete(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  sectionItemController.removeSectionItem
);

// Restore One by Id
sectionItemRouter.put(
  "/:id/restore",
  authenticate([ROLES.SUPER_ADMIN]),
  sectionItemController.restoreSectionItem
);

export default sectionItemRouter;
