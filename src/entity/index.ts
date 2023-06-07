import { DataSource } from "typeorm";
import "reflect-metadata";

import appConfig from "../config/appConfig";

import { Company } from "./company";
import { EmailOtp } from "./emailOtp";
import { ErrorLog } from "./errorLogs";
import { ResetPasswordToken } from "./resetPasswordToken";
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
  entities: [User, ErrorLog, EmailOtp, ResetPasswordToken, Company],
  migrations: [],
  subscribers: [],
});

export const userRepository = AppDataSource.getRepository(User);
export const errorLogRepository = AppDataSource.getRepository(ErrorLog);
export const emailOtpRepository = AppDataSource.getRepository(EmailOtp);
export const resetPassTokenRepository =
  AppDataSource.getRepository(ResetPasswordToken);
export const companyRepository = AppDataSource.getRepository(Company);
