import * as jwt from "jsonwebtoken";

import appConfig from "../config/appConfig";

import { User } from "../entity/user";

import userService from "./user";

const createToken = async (user: User, roles: string[]) => {
  const expiresIn = appConfig.jwtExpiry,
    secretOrKey = appConfig.jwtSecret;
  const userInfo = { id: user?.id, email: user?.email, roles: roles };
  const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
  return {
    expires_in: expiresIn,
    access_token: token,
  };
};

const createForgetPasswordToken = (email: string) => {
  const expiresIn = "15 min",
    secretOrKey = appConfig.jwtSecret;
  const userInfo = { user: email };
  const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
  return {
    expires_in: expiresIn,
    access_token: token,
  };
};

const createResetPasswordToken = async (email: string) => {
  const expiresIn = "3 min",
    secretOrKey = appConfig.jwtSecret;
  const userInfo = { user: email };
  const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
  return {
    expires_in: expiresIn,
    access_token: token,
  };
};

const decodeAndGetUser = async (access_token: string) => {
  const secretOrKey = appConfig.jwtSecret;
  if (!access_token) {
    return null;
  }
  const decoded: any = await jwt.verify(access_token, secretOrKey);
  const userFromDb = decoded?.id
    ? await userService.findOne(decoded?.id)
    : null;
  if (userFromDb) {
    return userFromDb;
  }
  return null;
};

const decodeAndGetUserWithToken = async (access_token: string) => {
  const secretOrKey = appConfig.jwtSecret;
  if (!access_token) {
    return null;
  }
  const decoded: any = await jwt.verify(access_token, secretOrKey);
  const userFromDb = decoded?.user
    ? await userService.findByEmail(decoded.email)
    : null;
  if (userFromDb) {
    return { user: userFromDb, token: access_token };
  }
  return null;
};

const verifyForgotPasswordToken = async (access_token: string) => {
  const secretOrKey = appConfig.jwtSecret;
  if (!access_token) {
    return null;
  }
  const decoded: any = await jwt.verify(access_token, secretOrKey);
  if (decoded) {
    return decoded;
  }
  return null;
};

const jwtService = {
  createToken,
  decodeAndGetUser,
  createForgetPasswordToken,
  createResetPasswordToken,
  decodeAndGetUserWithToken,
  verifyForgotPasswordToken,
};

export default jwtService;
