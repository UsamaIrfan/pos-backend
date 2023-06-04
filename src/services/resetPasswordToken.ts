import moment from "moment";

import { HttpException } from "../utils/response";

import jwtService from "./jwt";
import { resetPassTokenRepository } from "../entity";

const create = async (email: string) => {
  await resetPassTokenRepository.delete({ email });
  const { access_token } = await jwtService.createResetPasswordToken(email);
  const resetPasswordToken = resetPassTokenRepository.create({
    email,
    jwtToken: access_token,
  });
  return await resetPassTokenRepository.save(resetPasswordToken);
};

const verifyToken = async (jwtToken: string, email: string) => {
  const token = await resetPassTokenRepository.findOne({
    where: { email, jwtToken },
  });
  const hasExpired =
    token && moment(token?.createdAt).diff(moment(), "minutes") > 30;
  if (hasExpired) {
    await resetPassTokenRepository.delete({ email });
    throw new HttpException("Reset Password session has expired", 400);
  }
  if (!token) {
    throw new HttpException("Unable to verify reset password token", 400);
  }
  await resetPassTokenRepository.delete({ email });
  return true;
};

const resetPassTokenService = {
  create,
  verifyToken,
};

export default resetPassTokenService;
