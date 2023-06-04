import { Request } from "express";

import { User } from "../entity/user";

export interface AuthRequest extends Request {
  user?: User;
}
