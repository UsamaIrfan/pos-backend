import { FindManyOptions } from "typeorm";

export interface PaginationParams<T> extends FindManyOptions<T> {
  page: number;
  limit: number;
}
