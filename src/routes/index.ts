import express from "express";

import authRouter from "./auth";
import companyRouter from "./company";

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/company", companyRouter);

export default mainRouter;
