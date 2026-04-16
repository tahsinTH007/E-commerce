import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { fail } from "../utils/envelope";

// Centralized error handling middleware
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(fail(err.message, "APP_ERROR"));
  } else {
    console.error("error:", err);
    return res
      .status(500)
      .json(fail("Internal server error", "INTERNAL_ERROR"));
  }
}
