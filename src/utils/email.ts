import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";

import appConfig from "../config/appConfig";

export const sendEmail = async (
  to_email: string,
  subject: string,
  text: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: appConfig.emailHost,
      secure: false,
      auth: {
        user: appConfig.emailSender,
        pass: appConfig.emailPassword,
      },
    });

    return new Promise(async (resolve, reject) => {
      await transporter
        .sendMail({
          from: appConfig.emailSender,
          to: to_email,
          subject: subject,
          html: text,
        })
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          console.log("Email not sent : ", err);
          //   const errorlog = {
          //     cameFrom: "sendEmail",
          //     data: err,
          //   };
          reject(false);
        });
    });
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};

export const sendVerificationEmail = async (toEmail: string, otp: string) => {
  try {
    const file = await ejs.renderFile(
      path.join(__dirname, "../templates/emailVerify.html"),
      {
        OTP: otp,
        LINK: `${appConfig.emailVerifyUrl}?otp=${otp}&email=${toEmail}`,
      }
    );

    await sendEmail(toEmail, "Email Verification", file);
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};

export const sendForgetPasswordEmail = async (
  toEmail: string,
  otp: string,
  jwtToken: string
) => {
  try {
    const file = await ejs.renderFile(
      path.join(__dirname, "../templates/forgetPassword.html"),
      {
        OTP: otp,
        LINK: `${appConfig.resetPassUrl}?token=${jwtToken}&email=${toEmail}&otp=${otp}`,
      }
    );
    await sendEmail(toEmail, "Reset Password", file);
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};
