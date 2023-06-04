import { Request } from "express";
import _ from "lodash";

export default {
  object: (obj = {}, fields = []) => {
    return _.pick(obj, ..._.values(fields));
  },

  request: (
    req: Request,
    {
      body = [],
      params = [],
      query = [],
      headers = [],
    }: { body?: any[]; params?: any[]; query?: any[]; headers?: any[] }
  ) => {
    return _.merge(
      _.pick(req.body, ..._.values(body)),
      _.pick(req?.params, ..._.values(params)),
      _.pick(req?.query, ..._.values(query)),
      _.pick(req?.headers, ..._.values(headers))
    );
  },
};
