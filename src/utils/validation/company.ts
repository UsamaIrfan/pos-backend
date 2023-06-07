import Joi from "joi";

const create = Joi.object().keys({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Name is required" }),

  address: Joi.string()
    .required()
    .messages({ "any.required": "Address is required" }),

  phoneNumber: Joi.string()
    .required()
    .messages({ "any.required": "Phone number is required" }),

  otherDetails: Joi.string(),
});

const update = Joi.object().keys({
  name: Joi.string(),

  address: Joi.string(),

  phoneNumber: Joi.string(),

  otherDetails: Joi.string(),
});

const companyValidators = {
  create,
  update,
};

export default companyValidators;
