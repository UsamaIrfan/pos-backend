import { FindOptionsWhere } from "typeorm";

import { Account } from "../entity/account";
import { MasterAccount } from "../entity/masterAccount";
import { ItemTransaction } from "../entity/transaction";

import commonUtils from "../utils/common";
import { ACCOUNT_TYPES, ITEM_TYPES } from "../utils/enums";
import { HttpException } from "../utils/response";

import { PaginationParams } from "../types/app";

import accountService from "./account";
import masterAccountService from "./masterAccount";
import { AppDataSource, itemTransactionRepository } from "../entity";

const create = async (
  itemTransactionData: ItemTransaction & { companyId?: number },
  skipFundsCheck?: boolean
) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  const itemAccount = await accountService.findOne(itemTransactionData?.itemId);
  const cashAccount = await accountService.getCashAccount({
    companyId: itemTransactionData.companyId,
  });
  if (cashAccount.price < itemTransactionData.amount && !skipFundsCheck) {
    throw new HttpException("Cash account has insufficient funds.", 409);
  }
  let dbItemTransaction: ItemTransaction | null;
  let error: any;
  await queryRunner.startTransaction();
  try {
    // Handle Price Calculation on Item Account
    if (itemTransactionData.positive) {
      itemAccount.price = itemAccount.price + itemTransactionData.amount;
    } else {
      itemAccount.price = itemAccount.price - itemTransactionData.amount;
    }

    // Handle Quantity Calculation on Item Account
    if (itemAccount.quantity && itemAccount.quantity !== null) {
      if (itemTransactionData.positive) {
        itemAccount.quantity =
          itemAccount.quantity + itemTransactionData.quantity;
      } else {
        itemAccount.quantity =
          itemAccount.quantity - itemTransactionData.quantity;
      }
    }

    // Save Item Transaction to DB
    const itemTransaction = queryRunner.manager.create(
      ItemTransaction,
      itemTransactionData
    );
    const savedItemTransaction = await queryRunner.manager.save(
      ItemTransaction,
      itemTransaction
    );

    // Save Cash Transaction to DB
    const cashTransaction = queryRunner.manager.create(ItemTransaction, {
      positive: false,
      itemId: cashAccount.id,
      amount: itemTransactionData.amount,
    });
    await queryRunner.manager.save(ItemTransaction, cashTransaction);

    // Update/Save Item Account to DB
    await queryRunner.manager.save(Account, itemAccount);
    dbItemTransaction = savedItemTransaction;
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
  return { itemTransaction: dbItemTransaction };
};

const createCashCreditTransaction = async (
  itemTransactionData: Partial<ItemTransaction> & { companyId?: number }
) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  const masterAccounts = await masterAccountService.find({
    type: ACCOUNT_TYPES.ASSET,
  });
  let masterAccount = masterAccounts?.[0];

  // Get the cash account from accounts
  let cashAccount = await accountService.getCashAccount({
    companyId: itemTransactionData.companyId,
  });

  if (cashAccount.price < itemTransactionData.amount) {
    throw new HttpException("Cash account has insufficient funds.", 409);
  }
  let dbItemTransaction: ItemTransaction | null;
  let error: any;
  await queryRunner.startTransaction();
  try {
    if (!masterAccount) {
      const masterAccountModel = queryRunner.manager.create(MasterAccount, {
        name: "Asset Account",
        type: ACCOUNT_TYPES.ASSET,
      });
      masterAccount = await queryRunner.manager.save(
        MasterAccount,
        masterAccountModel
      );
    }

    // If Cash account exist, update the invested amount
    cashAccount.price = cashAccount.price - itemTransactionData.amount;
    cashAccount = await queryRunner.manager.save(Account, cashAccount);

    // Save Item Transaction to DB
    const itemTransaction = queryRunner.manager.create(ItemTransaction, {
      positive: false,
      itemId: cashAccount.id,
      amount: itemTransactionData.amount,
    });
    const savedItemTransaction = await queryRunner.manager.save(
      ItemTransaction,
      itemTransaction
    );

    // Save Cash Transaction to DB
    const cashTransaction = queryRunner.manager.create(ItemTransaction, {
      positive: false,
      itemId: cashAccount.id,
      amount: itemTransactionData.amount,
    });
    await queryRunner.manager.save(ItemTransaction, cashTransaction);

    // Update/Save Item Account to DB
    dbItemTransaction = savedItemTransaction;
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
  return { itemTransaction: dbItemTransaction };
};

const createCashDebitTransaction = async (
  itemTransactionData: Partial<ItemTransaction> & { companyId?: number }
) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  // Get the master asset account
  const masterAccounts = await masterAccountService.find({
    type: ACCOUNT_TYPES.ASSET,
  });
  let masterAccount = masterAccounts?.[0];

  // Get the cash account from accounts
  let cashAccount = await accountService.getCashAccount({
    companyId: itemTransactionData.companyId,
  });

  let dbItemTransaction: ItemTransaction | null;
  let error: any;
  await queryRunner.startTransaction();
  try {
    if (!masterAccount) {
      const masterAccountModel = queryRunner.manager.create(MasterAccount, {
        name: "Asset Account",
        type: ACCOUNT_TYPES.ASSET,
      });
      masterAccount = await queryRunner.manager.save(
        MasterAccount,
        masterAccountModel
      );
    }

    // If Cash account doesnot exist, create and initialize the investment
    if (!cashAccount) {
      const cashAccountModel = queryRunner.manager.create(Account, {
        title: "Cash Account",
        cashAccount: true,
        itemType: ITEM_TYPES.DEBIT,
        accountTypeId: masterAccount.id,
        price: itemTransactionData.amount,
        companyId: itemTransactionData.companyId,
      });
      cashAccount = await queryRunner.manager.save(Account, cashAccountModel);
    } else {
      // If Cash account exist, update the invested amount
      cashAccount.price = cashAccount.price + itemTransactionData.amount;
      cashAccount = await queryRunner.manager.save(Account, cashAccount);
    }

    // Save Item Transaction to DB
    const itemTransaction = queryRunner.manager.create(ItemTransaction, {
      positive: itemTransactionData.positive,
      itemId: itemTransactionData.itemId,
      amount: itemTransactionData.amount,
    });
    const savedItemTransaction = await queryRunner.manager.save(
      ItemTransaction,
      itemTransaction
    );

    // Save Cash Transaction to DB
    const cashTransaction = queryRunner.manager.create(ItemTransaction, {
      positive: true,
      itemId: cashAccount.id,
      amount: itemTransactionData.amount,
    });
    await queryRunner.manager.save(ItemTransaction, cashTransaction);

    // Update/Save Item Account to DB
    dbItemTransaction = savedItemTransaction;
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
  return { itemTransaction: dbItemTransaction };
};

const createInvestmentTransaction = async (
  itemTransactionData: ItemTransaction & { companyId?: number }
) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  const itemAccount = await accountService.findOne(itemTransactionData?.itemId);

  // If the provided account is not capital account
  if (itemAccount.accountType?.type !== ACCOUNT_TYPES.CAPITAL) {
    throw new HttpException(
      "Investment must be done in a capital account",
      409
    );
  }

  // Get the master asset account
  const masterAccounts = await masterAccountService.find({
    type: ACCOUNT_TYPES.ASSET,
  });
  let masterAccount = masterAccounts?.[0];

  // Get the cash account from accounts
  let cashAccount = await accountService.getCashAccount({
    companyId: itemTransactionData.companyId,
  });

  let dbCapitalTransaction: ItemTransaction | null;
  let error: any;
  await queryRunner.startTransaction();
  try {
    if (!masterAccount) {
      const masterAccountModel = queryRunner.manager.create(MasterAccount, {
        name: "Asset Account",
        type: ACCOUNT_TYPES.ASSET,
      });
      masterAccount = await queryRunner.manager.save(
        MasterAccount,
        masterAccountModel
      );
    }

    // If Cash account doesnot exist, create and initialize the investment
    if (!cashAccount) {
      const cashAccountModel = queryRunner.manager.create(Account, {
        title: "Cash Account",
        cashAccount: true,
        itemType: ITEM_TYPES.DEBIT,
        accountTypeId: masterAccount.id,
        price: itemTransactionData.amount,
        companyId: itemTransactionData.companyId,
      });
      cashAccount = await queryRunner.manager.save(Account, cashAccountModel);
    } else {
      // If Cash account exist, update the invested amount
      cashAccount.price = cashAccount.price + itemTransactionData.amount;
      cashAccount = await queryRunner.manager.save(Account, cashAccount);
    }

    // Add account to capital account
    itemAccount.price = itemAccount.price + itemTransactionData.amount;

    // Save Capital Transaction to DB
    const capitalTransaction = queryRunner.manager.create(ItemTransaction, {
      ...itemTransactionData,
      positive: true,
    });
    const savedCapitalTransaction = await queryRunner.manager.save(
      ItemTransaction,
      capitalTransaction
    );

    // Save Cash Transaction to DB
    const cashTransaction = queryRunner.manager.create(ItemTransaction, {
      positive: true,
      itemId: cashAccount.id,
      amount: itemTransactionData.amount,
    });
    await queryRunner.manager.save(ItemTransaction, cashTransaction);

    // Update/Save Item Account to DB
    await queryRunner.manager.save(Account, itemAccount);
    dbCapitalTransaction = savedCapitalTransaction;
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
  return { itemTransaction: dbCapitalTransaction };
};

const update = async (
  id: number,
  updateItemTransaction: Partial<ItemTransaction>
) => {
  return await itemTransactionRepository.update(id, updateItemTransaction);
};

const remove = async (id: number) => {
  return await itemTransactionRepository.softDelete(id);
};

const restore = async (id: number) => {
  return await itemTransactionRepository.restore(id);
};

const findOne = async (id: number) => {
  return await itemTransactionRepository.findOne({
    where: { id },
    relations: ["createdBy", "item"],
  });
};

const find = async (options: FindOptionsWhere<ItemTransaction>) => {
  return await itemTransactionRepository.find({
    where: options,
    relations: ["createdBy", "item"],
  });
};

const paginate = async ({
  page,
  limit,
  ...options
}: PaginationParams<ItemTransaction>) => {
  return await commonUtils.paginate<ItemTransaction>(
    itemTransactionRepository,
    options,
    {
      page,
      limit,
    }
  );
};

const itemTransactionService = {
  create,
  createInvestmentTransaction,
  createCashCreditTransaction,
  createCashDebitTransaction,
  update,
  remove,
  restore,
  findOne,
  find,
  paginate,
};

export default itemTransactionService;
