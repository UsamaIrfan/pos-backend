import express from "express";

import accountRouter from "./account";
import authRouter from "./auth";
import companyRouter from "./company";
import masterAccountRouter from "./masterAccount";

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/company", companyRouter);
mainRouter.use("/account", accountRouter);
mainRouter.use("/master-account", masterAccountRouter);

export default mainRouter;
