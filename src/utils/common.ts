import { FindManyOptions, Repository } from "typeorm";

import { AuthRequest } from "../types/request";

import { ROLES } from "./enums";

const isCompanyOwner = (req: AuthRequest) => {
  return (
    req?.user?.roles?.includes(ROLES.COMPANY_OWNER) &&
    req?.user?.roles?.includes(ROLES.SUPER_ADMIN)
  );
};

const paginate = async <T>(
  repository: Repository<T>,
  options: FindManyOptions<T>,
  { page, limit }: { page?: number; limit?: number }
) => {
  const [data, count] = await repository?.findAndCount({
    ...options,
    ...(page && limit ? { skip: +(page - 1) * +limit, take: +limit } : {}),
  });

  return {
    docs: data,
    meta: {
      itemCount: +data?.length,
      totalItems: +count,
      itemsPerPage: +limit,
      totalPages: +Math.ceil(count / limit),
      currentPage: +page,
    },
  };
};

const commonUtils = { isCompanyOwner, paginate };

export default commonUtils;
