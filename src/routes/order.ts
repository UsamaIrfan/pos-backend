import express from "express";

import orderController from "../controllers/order";

import authenticate from "../middlewares/auth";

import { ROLES } from "../utils/enums";

const orderRouter = express.Router();

// Create
orderRouter.post(
  "/",
  authenticate([ROLES.COMPANY_OWNER]),
  orderController.createOrder
);

// Get (Only Active)
orderRouter.get("/", authenticate(), orderController.getPaginated);

// Get (All)
orderRouter.get(
  "/all",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  orderController.getAll
);

// Get One By Id
orderRouter.get(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  orderController.getById
);

// Update One by Id
orderRouter.put(
  "/:id",
  authenticate([ROLES.COMPANY_OWNER]),
  orderController.updateOrder
);

// Soft delete One by Id
orderRouter.delete(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  orderController.removeOrder
);

// Soft delete One by Id
orderRouter.put(
  "/:id/restore",
  authenticate([ROLES.SUPER_ADMIN]),
  orderController.restoreOrder
);

export default orderRouter;
