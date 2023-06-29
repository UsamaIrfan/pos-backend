import { BOQ } from "../entity/boq";

import { AppDataSource, boqRepository } from "../entity";

const create = async (boqData: BOQ) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  let dbBoq: BOQ | null;
  let error: any;
  await queryRunner.startTransaction();
  try {
    const boq = queryRunner.manager.create(BOQ, boqData);
    const savedBoq = await queryRunner.manager.save(BOQ, boq);
    dbBoq = savedBoq;
    await queryRunner.commitTransaction();
  } catch (err) {
    error = err;
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
  return { error, boq: dbBoq };
};

const update = async (id: number, updateBoqObj: Partial<BOQ>) => {
  return await boqRepository.update(id, updateBoqObj);
};

const remove = async (id: number) => {
  return await boqRepository.softDelete(id);
};

const restore = async (id: number) => {
  return await boqRepository.restore(id);
};

const findOne = async (id: number) => {
  return await boqRepository.findOne({
    where: { id },
    relations: ["tender"],
  });
};

const find = async (options?: { tenderId?: number; companyId?: number }) => {
  const query = boqRepository
    .createQueryBuilder("boq")
    .leftJoinAndSelect("boq.tender", "tender");

  if (options.companyId) {
    query.where(`tender.companyId = ${options?.companyId}`);
  }

  if (options.tenderId) {
    query.andWhere(`boq.tenderId = ${options?.tenderId}`);
  }

  return await query.getMany();
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
