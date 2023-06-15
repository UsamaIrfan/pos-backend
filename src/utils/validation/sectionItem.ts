import Joi from "joi";

const create = Joi.object().keys({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Name is required" }),
  description: Joi.string(),
  quantity: Joi.number(),
  unit: Joi.string().messages({ "any.required": "Unit is required" }),
  price: Joi.number()
    .required()
    .messages({ "any.required": "Price is required" }),
  sectionId: Joi.number()
    .required()
    .messages({ "any.required": "Section ID is required" }),
});

const update = Joi.object().keys({
  name: Joi.string(),
  description: Joi.string(),
  quantity: Joi.number(),
  price: Joi.number(),
  unit: Joi.string(),
});

const sectionItemValidators = {
  create,
  update,
};

export default sectionItemValidators;
