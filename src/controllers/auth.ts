import * as bcrypt from "bcryptjs";
import { Request, Response } from "express";

import jwtService from "../services/jwt";
import emailOtpService from "../services/otp";
import resetPassTokenService from "../services/resetPasswordToken";
import userService from "../services/user";

import asyncHandler from "../utils/asyncHandler";
import clean from "../utils/clean";
import { sendForgetPasswordEmail, sendVerificationEmail } from "../utils/email";
import { HttpException, SuccessResponse } from "../utils/response";
import authValidators from "../utils/validation/user";

import { AuthRequest } from "../types/request";

const login = asyncHandler(async (req, res) => {
  const body = clean.request(req, { body: ["usernameOrEmail", "password"] });

  const { error, value } = authValidators.loginValidation.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const user = await userService.findByEmailOrUsername(
    value.usernameOrEmail,
    true
  );

  if (!user) {
    throw new HttpException("User not found", 404);
  }
  const passwordsMatch = await bcrypt.compare(value.password, user.password);
  if (!passwordsMatch) {
    throw new HttpException("User not found", 404);
  }
  delete user.password;
  const { access_token } = await jwtService.createToken(user, user.roles);
  res.status(200).send({ token: access_token, user, roles: user?.roles });
});

const signup = asyncHandler(async (req: Request, res: Response) => {
  const body = clean.request(req, {
    body: [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "password",
      "role",
      "username",
    ],
  });

  const { error, value } = authValidators.registerValidation.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const user = await userService.create({
    ...value,
    isVerified: false,
  });
  const otp = await emailOtpService.create(user?.email);
  await sendVerificationEmail(user?.email, otp?.token);
  res
    .status(200)
    .send(
      SuccessResponse(
        {},
        "A verification email has been sent on your email address"
      )
    );
});

const verifyEmailAddress = asyncHandler(async (req, res) => {
  const body = clean.request(req, { body: ["email", "otp"] });

  const { error, value } = authValidators.verifyEmailValidation.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const verified = await emailOtpService.verifyOtp(value.token, value.email);

  if (verified) {
    await userService.updateByEmail(value.email, { isVerified: true });
  }

  res
    .status(200)
    .send(
      SuccessResponse({}, "Email has been verified successfully. Please login.")
    );
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const body = clean.request(req, { body: ["email"] });

  const { error, value } =
    authValidators.resendEmailVerificationValidation.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const otp = await emailOtpService.create(value?.email);
  await sendVerificationEmail(value?.email, otp?.token);

  res
    .status(200)
    .send(
      SuccessResponse({}, "We have resent a verification code to your email")
    );
});

const changePassword = asyncHandler(async (req: AuthRequest, res) => {
  const body = clean.request(req, {
    body: ["oldPassword", "newPassword"],
  });

  const { error, value } =
    authValidators.changePasswordValidation.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const isValidPass = await bcrypt.compare(
    value.oldPassword,
    req.user?.password
  );
  if (!isValidPass) {
    throw new HttpException("Invalid old password", 400);
  }
  const password = await bcrypt.hash(value.newPassword, 10);
  await userService.update(req.user?.id, {
    password,
  });

  res.status(200).send(SuccessResponse({}, "Password changed successfully"));
});

const forgetPassword = asyncHandler(async (req, res) => {
  const body = clean.request(req, {
    body: ["email"],
  });

  const { error, value } =
    authValidators.forgetPasswordValidation.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  const user = await userService.findByEmail(value.email);
  if (!user) throw new HttpException("User not found.", 404);
  const otp = await emailOtpService.create(value.email);

  const { access_token } = await jwtService.createForgetPasswordToken(
    value.email
  );
  await sendForgetPasswordEmail(value?.email, otp?.token, access_token);
  if (otp) {
    res.status(200).send(
      SuccessResponse(
        {
          token: access_token,
          email: user.email,
        },
        "Email has been sent successfully."
      )
    );
  } else {
    throw new HttpException("Unable to create forgot password token.", 500);
  }
});

const verifyForgetPasswordToken = asyncHandler(async (req, res) => {
  const body = clean.request(req, { body: ["email", "otp"] });

  const { error, value } =
    authValidators.verifyForgetPasswordValidation.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  await emailOtpService.verifyOtp(value.otp, value.email);
  const { jwtToken } = await resetPassTokenService.create(value.email);

  res.status(200).send(
    SuccessResponse(
      {
        email: value?.email,
        token: jwtToken,
      },
      "Please change your password."
    )
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  const body = clean.request(req, {
    body: ["email", "resetPassToken", "password"],
  });

  const { error, value } =
    authValidators.resetPasswordValidation.validate(body);

  if (error) {
    throw new HttpException(error.message, 400);
  }

  await resetPassTokenService.verifyToken(value.resetPassToken, value.email);

  const password = await bcrypt.hash(value.password, 10);
  await userService.updateByEmail(value.email, {
    password,
  });
  res.status(200).send(SuccessResponse({}, "Password change successful"));
});

const authController = {
  login,
  signup,
  changePassword,
  verifyEmailAddress,
  forgetPassword,
  verifyForgetPasswordToken,
  resetPassword,
  resendVerificationEmail,
};

export default authController;
