import { DataSource } from "typeorm";
import "reflect-metadata";

import appConfig from "../config/appConfig";

import { EmailOtp } from "./emailOtp";
import { ErrorLog } from "./errorLogs";
import { User } from "./user";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: appConfig.dbHost,
  port: Number(appConfig.dbPort),
  username: appConfig.dbUser,
  password: appConfig.dbPass,
  database: appConfig.dbType,
  synchronize: true,
  logging: false,
  entities: [User, ErrorLog, EmailOtp],
  migrations: [],
  subscribers: [],
});

export const userRepository = AppDataSource.getRepository(User);
export const errorLogRepository = AppDataSource.getRepository(ErrorLog);
export const emailOtpRepository = AppDataSource.getRepository(EmailOtp);
