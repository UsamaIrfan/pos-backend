import { DataSource } from "typeorm";
import "reflect-metadata";

import appConfig from "../config/appConfig";

import { Account as Account } from "./account";
import { Company } from "./company";
import { EmailOtp } from "./emailOtp";
import { ErrorLog } from "./errorLogs";
import { MasterAccount } from "./masterAccount";
import { Order } from "./order";
import { OrderItem } from "./orderItem";
import { ResetPasswordToken } from "./resetPasswordToken";
import { ItemTransaction } from "./transaction";
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
  entities: [
    User,
    ErrorLog,
    EmailOtp,
    ResetPasswordToken,
    Company,
    Account,
    MasterAccount,
    ItemTransaction,
    OrderItem,
    Order,
  ],
  migrations: [],
  subscribers: [],
});

export const userRepository = AppDataSource.getRepository(User);
export const errorLogRepository = AppDataSource.getRepository(ErrorLog);
export const emailOtpRepository = AppDataSource.getRepository(EmailOtp);
export const resetPassTokenRepository =
  AppDataSource.getRepository(ResetPasswordToken);
export const companyRepository = AppDataSource.getRepository(Company);
export const accountRepository = AppDataSource.getRepository(Account);
export const masterAccountRepository =
  AppDataSource.getRepository(MasterAccount);
export const itemTransactionRepository =
  AppDataSource.getRepository(ItemTransaction);
export const orderItemRepository = AppDataSource.getRepository(OrderItem);
export const orderRepository = AppDataSource.getRepository(Order);
