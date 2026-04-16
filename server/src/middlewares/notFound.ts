import type { Request, Response } from "express";
import { fail } from "../utils/envelope";

// Middleware to handle 404 Not Found errors
export function notFoundHandler(req: Request, res: Response) {
  res
    .status(404)
    .json(fail(`Route not found: ${req.method} ${req.originalUrl}`));
}
