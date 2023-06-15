import Joi from "joi";

const create = Joi.object().keys({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Name is required" }),
  description: Joi.string().required(),
  tenderId: Joi.number()
    .required()
    .messages({ "any.required": "Tender ID is required" }),
});

const update = Joi.object().keys({
  name: Joi.string(),
  description: Joi.string(),
  quantity: Joi.number(),
  unit: Joi.string(),
});

const boqValidators = {
  create,
  update,
};

export default boqValidators;
