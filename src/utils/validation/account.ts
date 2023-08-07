import Joi from "joi";

import { ITEM_TYPES } from "../enums";

const create = Joi.object().keys({
  title: Joi.string()
    .required()
    .messages({ "any.required": "Title is required" }),
  description: Joi.string()
    .required()
    .messages({ "any.required": "Description is required" }),
  isCurrent: Joi.boolean().default(false),
  itemType: Joi.string()
    .valid(ITEM_TYPES.CREDIT, ITEM_TYPES.DEBIT)
    .required()
    .messages({ "any.required": "Description is required" }),
  accountTypeId: Joi.number()
    .required()
    .messages({ "any.required": "Account type is required" }),
  companyId: Joi.number()
    .required()
    .messages({ "any.required": "Company ID is required" }),
  price: Joi.number()
    .required()
    .messages({ "any.required": "Price is required" }),
  salePrice: Joi.number(),
  quantity: Joi.number(),
});

const update = Joi.object().keys({
  title: Joi.string(),
  description: Joi.string(),
  isCurrent: Joi.boolean(),
  accountTypeId: Joi.number(),
  itemType: Joi.string().valid(ITEM_TYPES.CREDIT, ITEM_TYPES.DEBIT),
  price: Joi.number(),
  salePrice: Joi.number(),
  quantity: Joi.number(),
});

const accountValidators = {
  create,
  update,
};

export default accountValidators;
