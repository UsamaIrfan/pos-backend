import Joi from "joi";

const create = Joi.object().keys({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Name is required" }),
  description: Joi.string(),
  quantity: Joi.number(),
  unit: Joi.string(),
  boqId: Joi.number()
    .required()
    .messages({ "any.required": "BOQ ID is required" }),
});

const update = Joi.object().keys({
  name: Joi.string(),
  description: Joi.string(),
  quantity: Joi.number(),
  unit: Joi.string(),
});

const sectionValidators = {
  create,
  update,
};

export default sectionValidators;
