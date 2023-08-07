import { FindOptionsWhere } from "typeorm";

import { Account } from "../entity/account";
import { MasterAccount } from "../entity/masterAccount";
import { ItemTransaction } from "../entity/transaction";
import { User } from "../entity/user";

import commonUtils from "../utils/common";
import { ACCOUNT_TYPES, ITEM_TYPES } from "../utils/enums";
import { HttpException } from "../utils/response";

import { PaginationParams } from "../types/app";

import masterAccountService from "./masterAccount";
import { accountRepository, AppDataSource } from "../entity";

const create = async (accountData: Account) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  const user = await queryRunner.manager.findOne(User, {
    where: { id: accountData?.id },
    relations: ["company"],
  });
  if (!user) throw new HttpException("User not found", 404);

  let dbAccount: Account | null;
  let error: any;

  // Get Global Cash Account
  let cashAccount = await getCashAccount({
    companyId: accountData.companyId,
  });

  // Get the global / master capital account
  const masterAccount = await masterAccountService.findOne(
    accountData.accountTypeId
  );
  if (!masterAccount) {
    throw new HttpException("Invalid master account ID.", 409);
  }

  // Get the global / master asset account
  const assetAccounts = await masterAccountService.find({
    type: ACCOUNT_TYPES.ASSET,
  });
  let assetAccount = assetAccounts?.[0];

  // Checking if the account is a debit account
  const isDebitAccount = [
    ACCOUNT_TYPES.ASSET,
    ACCOUNT_TYPES.INVENTORY,
    ACCOUNT_TYPES.LOSS,
    ACCOUNT_TYPES.EXPENSE,
    ACCOUNT_TYPES.DEPRECIATION,
  ].includes(masterAccount?.type);

  if (
    isDebitAccount &&
    cashAccount?.price <
      (accountData?.quantity
        ? accountData?.quantity * accountData?.price
        : accountData?.price)
  ) {
    throw new HttpException("Cash account has insufficient funds.", 409);
  }
  await queryRunner.startTransaction();
  try {
    const account = queryRunner.manager.create(Account, accountData);
    const savedAccount = await queryRunner.manager.save(Account, account);

    // Payload for transaction of current item account
    const transactionData = {
      positive: true,
      itemId: savedAccount.id,
      companyId: accountData?.companyId,
      ...(savedAccount.quantity
        ? {
            amount: savedAccount.price * savedAccount.quantity,
            quantity: savedAccount.quantity,
          }
        : { amount: savedAccount.price }),
    };

    // If Asset master account doesnot exist, create
    if (!assetAccount) {
      const assetAccountModel = queryRunner.manager.create(MasterAccount, {
        name: "Asset Account",
        type: ACCOUNT_TYPES.ASSET,
      });
      assetAccount = await queryRunner.manager.save(
        MasterAccount,
        assetAccountModel
      );
    }

    // If Cash account doesnot exist, create and initialize the investment
    if (!cashAccount) {
      const cashAccountModel = queryRunner.manager.create(Account, {
        title: "Cash Account",
        cashAccount: true,
        itemType: ITEM_TYPES.DEBIT,
        accountTypeId: assetAccount.id,
        price: transactionData.amount,
        companyId: transactionData.companyId,
      });
      cashAccount = await queryRunner.manager.save(Account, cashAccountModel);
    } else {
      // If Cash account exist, update the invested amount
      if (isDebitAccount) {
        cashAccount.price = cashAccount.price - transactionData.amount;
      } else {
        cashAccount.price = cashAccount.price + transactionData.amount;
      }
      cashAccount = await queryRunner.manager.save(Account, cashAccount);
    }

    // Save Item Transaction to DB
    const itemTransaction = queryRunner.manager.create(ItemTransaction, {
      positive: true,
      itemId: savedAccount.id,
      amount: transactionData.amount,
    });
    await queryRunner.manager.save(ItemTransaction, itemTransaction);

    // Save Cash Transaction to DB
    const cashTransaction = queryRunner.manager.create(ItemTransaction, {
      positive: !isDebitAccount,
      itemId: cashAccount.id,
      amount: transactionData.amount,
    });
    await queryRunner.manager.save(ItemTransaction, cashTransaction);

    dbAccount = savedAccount;
    await queryRunner.commitTransaction();
  } catch (err) {
    error = err;
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
  if (error) {
    throw new HttpException(error?.message, 500);
  }
  return { account: dbAccount };
};

const update = async (id: number, updateAccountObj: Partial<Account>) => {
  return await accountRepository.update(id, updateAccountObj);
};

const remove = async ({ id, companyId }: { id: number; companyId: number }) => {
  const cashAccount = await getCashAccount({ companyId });

  const itemAccount = await accountRepository.findOne({ where: { id } });

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  await queryRunner.startTransaction();

  let deletedAccount: any;
  let error: any;
  try {
    // Depending on item type adjust the cash account
    if (itemAccount.itemType === ITEM_TYPES.CREDIT) {
      cashAccount.price = cashAccount.price - itemAccount.price;
    } else {
      cashAccount.price = cashAccount.price + itemAccount.price;
    }

    // Update the cash account
    await queryRunner.manager.save(Account, cashAccount);

    // Delete the account by id
    deletedAccount = await queryRunner.manager.softDelete(Account, id);

    // Finally commit the transaction
    await queryRunner.commitTransaction();
  } catch (err) {
    error = err;
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
  if (error) {
    throw new HttpException(error?.message, 500);
  }

  return deletedAccount;
};

const restore = async (id: number) => {
  return await accountRepository.restore(id);
};

const findOne = async (id: number) => {
  return await accountRepository.findOne({
    where: { id },
    relations: ["company", "accountType"],
  });
};

const find = async (options: FindOptionsWhere<Account>) => {
  const query = accountRepository
    .createQueryBuilder("account")
    .leftJoinAndSelect("account.company", "company")
    .leftJoinAndSelect("account.accountType", "accountType")
    .where(
      options?.companyId ? `account.companyId = ${options?.companyId}` : ""
    );
  if (options?.title && options?.title !== "") {
    query.andWhere(`title ILIKE '%${options?.title}%'`);
  }
  if (options?.accountTypeId) {
    query.andWhere(`account.accountTypeId = ${options?.accountTypeId}`);
  }
  return await query.getMany();
};

const paginate = async ({
  page,
  limit,
  ...options
}: PaginationParams<Account>) => {
  return await commonUtils.paginate<Account>(accountRepository, options, {
    page,
    limit,
  });
};

const getCashAccount = async ({ companyId }: { companyId: number }) => {
  return await accountRepository.findOne({
    where: { cashAccount: true, companyId },
  });
};

const accountService = {
  create,
  update,
  remove,
  restore,
  findOne,
  find,
  paginate,
  getCashAccount,
};

export default accountService;
