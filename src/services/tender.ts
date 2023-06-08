import { FindOptionsWhere } from "typeorm";

import { Tender } from "../entity/tender";
import { User } from "../entity/user";

import { HttpException } from "./../utils/response";

import { AppDataSource, tenderRepository } from "../entity";

const create = async (tenderData: Tender) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  const user = await queryRunner.manager.findOne(User, {
    where: { id: tenderData?.id },
    relations: ["company"],
  });
  if (!user) throw new HttpException("User not found", 404);

  let dbTender: Tender | null;
  let error: any;
  await queryRunner.startTransaction();
  try {
    const company = queryRunner.manager.create(Tender, tenderData);
    const savedTender = await queryRunner.manager.save(Tender, company);
    dbTender = savedTender;
    await queryRunner.commitTransaction();
  } catch (err) {
    error = err;
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
  return { error, tender: dbTender };
};

const update = async (id: number, updateTenderObj: Partial<Tender>) => {
  return await tenderRepository.update(id, updateTenderObj);
};

const remove = async (id: number) => {
  return await tenderRepository.softDelete(id);
};

const restore = async (id: number) => {
  return await tenderRepository.restore(id);
};

const findOne = async (id: number) => {
  return await tenderRepository.findOne({
    where: { id },
    relations: ["createdBy", "company", "boqs"],
  });
};

const find = async (options: FindOptionsWhere<Tender>) => {
  return await tenderRepository.find({
    where: options,
    relations: ["createdBy", "company", "boqs"],
  });
};

const tenderService = {
  create,
  update,
  remove,
  restore,
  findOne,
  find,
};

export default tenderService;
