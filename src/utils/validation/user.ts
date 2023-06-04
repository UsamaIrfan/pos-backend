import Joi from "joi";

import { ROLES } from "../enums";

const registerValidation = Joi.object().keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string()
    .email()
    .required()
    .messages({ "any.required": "Email is required" }),
  phoneNumber: Joi.string()
    .regex(
      /^\+(?:[0-9]●?){6,14}[0-9]$/,
      "Phone number must be a valid phone number"
    )
    .required()
    .messages({ "any.required": "Phone number is required" }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({ "any.required": "Password is required" }),
  roles: Joi.array()
    .items(
      Joi.string().valid(ROLES.COMPANY_OWNER, ROLES.COMPANY_STAFF, ROLES.USER)
    )
    .default([ROLES.USER]),
  username: Joi.string()
    .required()
    .messages({ "any.required": "Username is required" }),
});

const loginValidation = Joi.object().keys({
  usernameOrEmail: Joi.string()
    .required()
    .messages({ "any.required": "Username or email is required" }),

  password: Joi.string()
    .required()
    .messages({ "any.required": "Password is required" }),
});

const verifyEmailValidation = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .messages({ "any.required": "Email address is required" }),

  token: Joi.string()
    .required()
    .messages({ "any.required": "Verification token is required" }),
});

const verifyForgetPasswordValidation = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .messages({ "any.required": "Email address is required" }),

  token: Joi.string()
    .required()
    .messages({ "any.required": "Verification token is required" }),

  forgetPassToken: Joi.string(),
});

const resetPasswordValidation = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .messages({ "any.required": "Email address is required" }),

  password: Joi.string()
    .required()
    .messages({ "any.required": "Password is required" }),

  resetPassToken: Joi.string().required().messages({
    "any.required": "Reset Password verification token is required",
  }),
});

const changePasswordValidation = Joi.object().keys({
  oldPassword: Joi.string()
    .required()
    .messages({ "any.required": "Old Password is required" }),

  newPassword: Joi.string()
    .required()
    .messages({ "any.required": "New Password is required" }),
});

const forgetPasswordValidation = Joi.object().keys({
  email: Joi.string()
    .required()
    .messages({ "any.required": "Email is required" }),
});

const authValidators = {
  loginValidation,
  registerValidation,
  verifyEmailValidation,
  changePasswordValidation,
  forgetPasswordValidation,
  verifyForgetPasswordValidation,
  resetPasswordValidation,
};

export default authValidators;
