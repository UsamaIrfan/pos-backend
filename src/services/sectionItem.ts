import { FindOptionsWhere } from "typeorm";

import { Section } from "../entity/section";
import { SectionItem } from "../entity/sectionItem";

import commonUtils from "../utils/common";
import { HttpException } from "./../utils/response";

import { PaginationParams } from "../types/app";

import { AppDataSource, sectionItemRepository } from "../entity";

const create = async (sectionData: Section) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  let dbSectionItem: SectionItem | null;
  let error: any;
  await queryRunner.startTransaction();
  try {
    const sectionItem = queryRunner.manager.create(SectionItem, sectionData);
    const savedSection = await queryRunner.manager.save(
      SectionItem,
      sectionItem
    );
    dbSectionItem = savedSection;
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
  return dbSectionItem;
};

const update = async (
  id: number,
  updateSectionItemObj: Partial<SectionItem>
) => {
  return await sectionItemRepository.update(id, updateSectionItemObj);
};

const remove = async (id: number) => {
  return await sectionItemRepository.softDelete(id);
};

const restore = async (id: number) => {
  return await sectionItemRepository.restore(id);
};

const findOne = async (id: number) => {
  return await sectionItemRepository.findOne({
    where: { id },
    relations: ["section"],
  });
};

const find = async (options: FindOptionsWhere<SectionItem>) => {
  return await sectionItemRepository.find({
    where: options,
    relations: ["section"],
  });
};

const paginate = async ({
  page,
  limit,
  ...options
}: PaginationParams<SectionItem>) => {
  return await commonUtils.paginate<SectionItem>(
    sectionItemRepository,
    options,
    {
      page,
      limit,
    }
  );
};

const sectionItemService = {
  create,
  update,
  remove,
  restore,
  findOne,
  find,
  paginate,
};

export default sectionItemService;
