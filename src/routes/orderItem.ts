import express from "express";

import orderController from "../controllers/orderItem";

import authenticate from "../middlewares/auth";

import { ROLES } from "../utils/enums";

const orderItemRouter = express.Router();

// Create
orderItemRouter.post(
  "/",
  authenticate([ROLES.COMPANY_OWNER]),
  orderController.createOrderItem
);

// Get (Only Active)
orderItemRouter.get("/", authenticate(), orderController.getPaginated);

// Get (All)
orderItemRouter.get(
  "/all",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  orderController.getAll
);

// Get One By Id
orderItemRouter.get(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  orderController.getById
);

// Update One by Id
orderItemRouter.put(
  "/:id",
  authenticate([ROLES.COMPANY_OWNER]),
  orderController.updateOrderItem
);

// Soft delete One by Id
orderItemRouter.delete(
  "/:id",
  authenticate([ROLES.SUPER_ADMIN, ROLES.COMPANY_OWNER]),
  orderController.removeOrderItem
);

// Soft delete One by Id
orderItemRouter.put(
  "/:id/restore",
  authenticate([ROLES.SUPER_ADMIN]),
  orderController.restoreOrderItem
);

export default orderItemRouter;
