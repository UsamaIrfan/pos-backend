import * as jwt from "jsonwebtoken";

import appConfig from "../config/appConfig";

import { User } from "../entity/user";

import { userRepository } from "../entity";

const createToken = async (emailOrContact: string, roles: string[]) => {
  const expiresIn = appConfig.jwtExpiry,
    secretOrKey = appConfig.jwtSecret;
  const userInfo = { user: emailOrContact, roles: roles };
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
  const userFromDb = decoded?.user
    ? await userRepository.findOneBy({ email: decoded.user })
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
    ? await userRepository.findOneBy({ email: decoded.user })
    : null;
  if (userFromDb) {
    return { user: userFromDb, token: access_token };
  }
  return null;
};

const validateUser = async (signedUser): Promise<User> => {
  const userFromDb = signedUser?.user
    ? await userRepository.findOneBy({ email: signedUser.user })
    : null;
  if (userFromDb) {
    return userFromDb;
  }
  return null;
};

const jwtService = {
  createToken,
  validateUser,
  decodeAndGetUser,
  createForgetPasswordToken,
  createResetPasswordToken,
  decodeAndGetUserWithToken,
};

export default jwtService;
