import jwtService from "../services/jwt";

import asyncHandler from "../utils/asyncHandler";
import { ROLES } from "../utils/enums";
import { HttpException } from "../utils/response";

import { AuthRequest } from "../types/request";

const authenticate = (roles?: ROLES[]) =>
  asyncHandler(async (req: AuthRequest, res, next) => {
    let token: string | null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) throw new HttpException("Unauthorized", 401);

    const user = await jwtService.decodeAndGetUser(token);

    if (!user) throw new HttpException("Unauthorized, user not found", 401);

    if (roles) {
      const hasAccess = roles?.some((role) => user?.roles?.includes(role));

      if (!hasAccess) throw new HttpException("Forbidden resource", 403);
    }

    req.user = user;

    next();
  });

export default authenticate;
