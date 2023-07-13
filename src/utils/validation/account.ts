import Joi from "joi";

const create = Joi.object().keys({
  title: Joi.string()
    .required()
    .messages({ "any.required": "Title is required" }),
  description: Joi.string()
    .required()
    .messages({ "any.required": "Description is required" }),
  companyId: Joi.number()
    .required()
    .messages({ "any.required": "Company ID is required" }),
});

const update = Joi.object().keys({
  title: Joi.string(),
  description: Joi.string(),
});

const accountValidators = {
  create,
  update,
};

export default accountValidators;
