import express from "express";

import boqController from "../controllers/boq";

import authenticate from "../middlewares/auth";

import { ROLES } from "../utils/enums";

const boqRouter = express.Router();

// Create
boqRouter.post(
  "/",
  authenticate([ROLES.COMPANY_OWNER]),
  boqController.createBoq
);

// Get (Only Active)
boqRouter.get("/", authenticate(), boqController.get);

// Get (All)
boqRouter.get(
  "/all",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  boqController.getAll
);

// Get One By Id
boqRouter.get(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  boqController.getById
);

// Update One by Id
boqRouter.put(
  "/:id",
  authenticate([ROLES.COMPANY_OWNER]),
  boqController.updateBoq
);

// Soft delete One by Id
boqRouter.delete(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  boqController.removeBoq
);

// Restore One by Id
boqRouter.put(
  "/:id/restore",
  authenticate([ROLES.SUPER_ADMIN]),
  boqController.restoreBoq
);

export default boqRouter;
