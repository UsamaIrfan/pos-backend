import moment from "moment";

import { HttpException } from "../utils/response";

import { emailOtpRepository } from "../entity";

const create = async (email: string) => {
  const exists = await emailOtpRepository.findOne({
    where: { email },
  });
  const hasExpired = moment().diff(exists?.createdAt, "minutes") >= 2;
  if (!hasExpired && !!exists) {
    throw new HttpException(
      "An OTP has already been sent to your email address. You can retry after 2 minutes",
      400
    );
  }
  await emailOtpRepository.delete({ email });
  const token = (Math.floor(Math.random() * 900000) + 100000).toString();
  const otp = emailOtpRepository.create({ email, token });
  return await emailOtpRepository.save(otp);
};

const verifyOtp = async (token: string, email: string) => {
  const otp = await emailOtpRepository.findOne({ where: { email, token } });
  const hasExpired =
    otp && moment(otp?.createdAt).diff(moment(), "minutes") > 30;
  if (hasExpired) {
    await emailOtpRepository.delete({ email });
    throw new HttpException(
      "OTP expired. Unable to verify the code. Please try resending the OTP",
      400
    );
  }
  if (!otp) {
    throw new HttpException(
      "Unable to verify the code. Please try resending the OTP",
      400
    );
  }
  await emailOtpRepository.delete({ email });
  return true;
};

const emailOtpService = {
  create,
  verifyOtp,
};

export default emailOtpService;
