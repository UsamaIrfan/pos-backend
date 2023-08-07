import Joi from "joi";

const create = Joi.object().keys({
  salePrice: Joi.number().required(),
  saleQuantity: Joi.number().required(),
  itemId: Joi.number().required(),
  orderId: Joi.number().required(),
});

const update = Joi.object().keys({
  salePrice: Joi.number().required(),
  saleQuantity: Joi.number().required(),
  itemId: Joi.number().required(),
});

const orderItemValidators = {
  create,
  update,
};

export default orderItemValidators;
