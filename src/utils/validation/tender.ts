import Joi from "joi";

const create = Joi.object().keys({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Name is required" }),
  description: Joi.string()
    .required()
    .messages({ "any.required": "Description is required" }),
  companyId: Joi.number()
    .required()
    .messages({ "any.required": "Company ID is required" }),
});

const update = Joi.object().keys({
  name: Joi.string(),
  description: Joi.string(),
});

const tenderValidators = {
  create,
  update,
};

export default tenderValidators;
