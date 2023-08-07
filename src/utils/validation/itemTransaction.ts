import Joi from "joi";

const create = Joi.object().keys({
  amount: Joi.number()
    .required()
    .messages({ "any.required": "Sale price is required" }),
  quantity: Joi.number(),
  itemId: Joi.number()
    .required()
    .messages({ "any.required": "Item ID is required" }),
  companyId: Joi.number()
    .required()
    .messages({ "any.required": "Company ID is required" }),
});

const update = Joi.object().keys({
  amount: Joi.number(),
  quantity: Joi.number(),
  itemId: Joi.number(),
});

const itemTransactionValidators = {
  create,
  update,
};

export default itemTransactionValidators;
