import Joi from "joi";

const create = Joi.object().keys({
  orderItems: Joi.array()
    .items(
      Joi.object().keys({
        salePrice: Joi.number().required(),
        price: Joi.number().required(),
        saleQuantity: Joi.number().required(),
        itemId: Joi.number().required(),
      })
    )
    .min(1)
    .required()
    .messages({ "any.required": "Title is required" }),
  companyId: Joi.number()
    .required()
    .messages({ "any.required": "Company ID is required" }),
});

const update = Joi.object().keys({
  orderItems: Joi.array().items(
    Joi.object().keys({
      salePrice: Joi.number().required(),
      price: Joi.number().required(),
      saleQuantity: Joi.number().required(),
      itemId: Joi.number().required(),
    })
  ),
});

const orderValidators = {
  create,
  update,
};

export default orderValidators;
