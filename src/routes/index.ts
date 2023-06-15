import express from "express";

import authRouter from "./auth";
import boqRouter from "./boq";
import companyRouter from "./company";
import sectionRouter from "./section";
import sectionItemRouter from "./sectionItem";
import tenderRouter from "./tender";

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/boq", boqRouter);
mainRouter.use("/company", companyRouter);
mainRouter.use("/section", sectionRouter);
mainRouter.use("/section-item", sectionItemRouter);
mainRouter.use("/tender", tenderRouter);

export default mainRouter;
