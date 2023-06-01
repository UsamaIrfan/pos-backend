import express from "express";

import authController from "../controllers/auth";

const authRouter = express.Router();

authRouter.post("/register", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post("/change-password", authController.changePassword);
// userRouter.post("/generate-otp", generateMobileOTP);
// userRouter.post("/verify-otp", verifyOtp);

export default authRouter;
