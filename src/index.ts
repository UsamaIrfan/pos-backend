import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { logEnvironmentVariables } from "./helpers/envLogger";

import { AppDataSource } from "./utils/dataSource";

import mainRouter from "./routes";

dotenv.config();

const PORT = process.env.APP_PORT || 5000;

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("Connected To Postgres");

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(function (req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
      );
      res.setHeader("Access-Control-Allow-Credentials", true as any);
      next();
    });
    app.use(cors());

    app.use(express.static("src/public"));
    app.use(express.static("src/public/editor"));
    app.use(express.static("build/public"));
    app.use(express.static("build/public/editor"));

    app.get("/", (req, res) => {
      res.json({ message: "Welcome to ProcureX backend." });
    });

    app.use("/", mainRouter);

    app.listen(PORT, () => {
      console.log("=====> EnvironmentVariables", logEnvironmentVariables());
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
  }
}

startServer();
