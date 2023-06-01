import * as bcrypt from "bcryptjs";
import { Request, Response } from "express";

import jwtService from "../services/jwt";
import userService from "../services/user";

import asyncHandler from "../utils/asyncHandler";
import { HttpException, SuccessResponse } from "../utils/response";

const login = asyncHandler(async (req, res) => {
  const user = await userService.findByEmail(req.body.email);
  if (!user) {
    throw new HttpException("User not found", 404);
  }
  const passwordsMatch = await bcrypt.compare(req.body.password, user.password);
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
  const signUpDto = req.body;
  const user = await userService.create(signUpDto);
  res.status(200).send(SuccessResponse(user));
});

const changePassword = asyncHandler(async (changePasswordInput: any) => {
  const isValidPass = await bcrypt.compare(
    changePasswordInput.oldPassword,
    changePasswordInput.user?.password
  );
  if (!isValidPass) {
    // throw new HttpException("Invalid old password", HttpStatus.BAD_REQUEST);
  }
  const password = await bcrypt.hash(changePasswordInput.newPassword, 10);
  await userService.update(changePasswordInput.user?.id, {
    password,
  });

  return {
    success: true,
    message: "Password change successful",
  };
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
};

export default authController;
