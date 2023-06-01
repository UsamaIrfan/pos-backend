import { NextFunction, Request, Response } from "express";

import { HttpException } from "../utils/response";

// eslint-disable-next-line no-unused-vars
const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const errors = [];

  // API Not Found
  if (err.message === "Not Found") {
    err = new HttpException("Not Found", 404);
  }

  res.status(err.status || 500).json({
    success: false,
    status: err.status || 500,
    message: err.message || "Server Error",
    errors,
  });
};

export default errorHandler;
