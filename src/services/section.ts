import { FindOptionsWhere } from "typeorm";

import { Section } from "../entity/section";

import { HttpException } from "./../utils/response";

import { AppDataSource, sectionRepository } from "../entity";

const create = async (sectionData: Section) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  let dbSection: Section | null;
  let error: any;
  await queryRunner.startTransaction();
  try {
    const section = queryRunner.manager.create(Section, sectionData);
    const savedSection = await queryRunner.manager.save(Section, section);
    dbSection = savedSection;
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
  return dbSection;
};

const update = async (id: number, updateSectionObj: Partial<Section>) => {
  return await sectionRepository.update(id, updateSectionObj);
};

const remove = async (id: number) => {
  return await sectionRepository.softDelete(id);
};

const restore = async (id: number) => {
  return await sectionRepository.restore(id);
};

const findOne = async (id: number) => {
  return await sectionRepository.findOne({
    where: { id },
    relations: ["boq"],
  });
};

const find = async (options: FindOptionsWhere<Section>) => {
  return await sectionRepository.find({
    where: options,
    relations: ["boq"],
  });
};

const sectionService = {
  create,
  update,
  remove,
  restore,
  findOne,
  find,
};

export default sectionService;
