import Joi from "joi";

import { ACCOUNT_TYPES } from "../enums";

const create = Joi.object().keys({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Name is required" }),
  type: Joi.string()
    .valid(
      ACCOUNT_TYPES.INVENTORY,
      ACCOUNT_TYPES.ASSET,
      ACCOUNT_TYPES.CAPITAL,
      ACCOUNT_TYPES.DEPRECIATION,
      ACCOUNT_TYPES.LIABILITY,
      ACCOUNT_TYPES.LOSS,
      ACCOUNT_TYPES.REVENUE,
      ACCOUNT_TYPES.EXPENSE
    )
    .required()
    .messages({ "any.required": "Type is required" }),
  companyId: Joi.number()
    .required()
    .messages({ "any.required": "Company ID is required" }),
});

const update = Joi.object().keys({
  name: Joi.string(),
  type: Joi.string().valid(
    ACCOUNT_TYPES.INVENTORY,
    ACCOUNT_TYPES.ASSET,
    ACCOUNT_TYPES.CAPITAL,
    ACCOUNT_TYPES.DEPRECIATION,
    ACCOUNT_TYPES.LIABILITY,
    ACCOUNT_TYPES.LOSS,
    ACCOUNT_TYPES.REVENUE,
    ACCOUNT_TYPES.EXPENSE
  ),
});

const masterAccountValidators = {
  create,
  update,
};

export default masterAccountValidators;
