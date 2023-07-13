import Joi from "joi";

const create = Joi.object().keys({
  salePrice: Joi.number()
    .required()
    .messages({ "any.required": "Sale price is required" }),
  saleQuantity: Joi.number()
    .required()
    .messages({ "any.required": "Sale quantity is required" }),
  itemId: Joi.number()
    .required()
    .messages({ "any.required": "Item ID is required" }),
});

const update = Joi.object().keys({
  salePrice: Joi.number(),
  saleQuantity: Joi.number(),
  itemId: Joi.number(),
});

const itemTransactionValidators = {
  create,
  update,
};

export default itemTransactionValidators;
