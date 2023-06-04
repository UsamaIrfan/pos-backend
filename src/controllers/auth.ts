import * as bcrypt from "bcryptjs";
import { Request, Response } from "express";

import jwtService from "../services/jwt";
import emailOtpService from "../services/otp";
import userService from "../services/user";

import asyncHandler from "../utils/asyncHandler";
import clean from "../utils/clean";
import { sendVerificationEmail } from "../utils/email";
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
  const { access_token } = await jwtService.createToken(
    req.body.email,
    user.roles
  );
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
  const body = clean.request(req, { body: ["email", "token"] });

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

const changePassword = asyncHandler(async (req: AuthRequest, res) => {
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

// const forgetPassword = async (forgetPasswordInput: ForgetPasswordDto) => {
//   const user = await userService.findByEmail(forgetPasswordInput.email);
//   if (!user) {
//     return {
//       success: false,
//       message: "User not found.",
//     };
//   }
//   const code = (Math.floor(Math.random() * 900000) + 100000).toString();
//   const forgottenPasswordModel = await forgotPasswordRepository.upsert(
//     {
//       email: forgetPasswordInput.email,
//       forgetPasswordToken: code,
//     },
//     ["email"]
//   );

//   const { access_token } = await jwtService.createForgetPasswordToken(
//     forgetPasswordInput.email
//   );
//   await mailService.sendForgetPasswordEmail({ user, code });
//   if (forgottenPasswordModel) {
//     return {
//       token: access_token,
//       email: user.email,
//       success: true,
//       message: "Email has been sent successfully.",
//     };
//   } else {
//     // throw new HttpException(
//     //   "Unable to create forgot password token.",
//     //   HttpStatus.INTERNAL_SERVER_ERROR
//     // );
//   }
// };

// const verifyForgetPasswordToken = async (
//   verifyForgetPasswordTokenInput: VerifyForgetPasswordDto
// ) => {
//   const emailVerif: any = await forgotPasswordRepository.findOne({
//     where: {
//       forgetPasswordToken: verifyForgetPasswordTokenInput.token,
//       email: verifyForgetPasswordTokenInput.email,
//     },
//   });
//   if (
//     emailVerif &&
//     (new Date().getTime() - new Date(emailVerif?.updatedAt).getTime()) / 60000 >
//       10
//   ) {
//     // throw new HttpException(
//     //   "Your verification code has expired.",
//     //   HttpStatus.BAD_REQUEST
//     // );
//   }
//   if (emailVerif && emailVerif.email) {
//     const { access_token } = await jwtService.createResetPasswordToken(
//       emailVerif.email
//     );
//     return {
//       token: access_token,
//       success: true,
//       message: "Please change your password.",
//     };
//   } else {
//     // throw new HttpException(
//     //   "Invalid code or unable to authenticate.",
//     //   HttpStatus.BAD_REQUEST
//     // );
//   }
// };

// const resetPassword = async (resetPasswordInput: ResetPasswordDto) => {
//   const emailVerif: any = await forgotPasswordRepository.delete({
//     forgetPasswordToken: resetPasswordInput.token,
//     email: resetPasswordInput.email,
//   });
//   if (
//     emailVerif &&
//     (new Date().getTime() - new Date(emailVerif?.updatedAt).getTime()) / 60000 >
//       10
//   ) {
//     // throw new HttpException(
//     //   "Your verification code has expired.",
//     //   HttpStatus.BAD_REQUEST
//     // );
//   }
//   if (emailVerif) {
//     const password = await bcrypt.hash(resetPasswordInput.password, 10);
//     await userService.updateByEmail(resetPasswordInput.email, {
//       password,
//     });
//     return {
//       success: true,
//       message: "Password change successful",
//     };
//   } else {
//     // throw new HttpException(
//     //   "Invalid token or unable to authenticate.",
//     //   HttpStatus.BAD_REQUEST
//     // );
//   }
// };

const authController = {
  login,
  signup,
  changePassword,
  verifyEmailAddress,
};

export default authController;
