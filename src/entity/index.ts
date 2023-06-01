import { DataSource } from "typeorm";
import "reflect-metadata";

import { ErrorLog } from "./errorLogs";
import { User } from "./user";

require("dotenv").config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, ErrorLog],
  migrations: [],
  subscribers: [],
});
