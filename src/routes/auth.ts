import express from "express";

import authController from "../controllers/auth";

import authenticate from "../middlewares/auth";

const authRouter = express.Router();

authRouter.post("/register", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post(
  "/change-password",
  authenticate(),
  authController.changePassword
);
authRouter.post("/verify-email/resend", authController.resendVerificationEmail);
authRouter.post("/verify-email", authController.verifyEmailAddress);
authRouter.post("/forgot-password", authController.forgetPassword);
authRouter.post("/verify-forgot", authController.verifyForgetPasswordToken);
authRouter.post("/reset-password", authController.resetPassword);

export default authRouter;
