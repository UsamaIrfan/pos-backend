import Joi from "joi";

const create = Joi.object().keys({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Name is required" }),
  boqId: Joi.number()
    .required()
    .messages({ "any.required": "BOQ ID is required" }),
});

const update = Joi.object().keys({
  name: Joi.string(),
});

const sectionValidators = {
  create,
  update,
};

export default sectionValidators;
