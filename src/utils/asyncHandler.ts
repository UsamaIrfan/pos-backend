import { NextFunction, Request, Response } from "express";

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => any) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch((error) => next(error));

export default asyncHandler;
