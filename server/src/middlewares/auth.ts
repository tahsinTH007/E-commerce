import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

import { User } from "../models/User";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

// Middleware to require authentication
export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return next(new AppError(401, "User is not logged in. Unauthorized"));
  }

  next();
};

// Helper function to get the database user from the request
export async function getDbUserFromRequest(req: Request) {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new AppError(401, "User is not logged in. Unauthorized");
  }

  const dbUser = await User.findOne({ clerkUserId: userId });

  if (!dbUser) {
    throw new AppError(404, "User not found in database");
  }

  return dbUser;
}

// Middleware to require admin role
export const requireAdmin = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const extractCurrentDbUser = await getDbUserFromRequest(req);

    if (extractCurrentDbUser.role !== "admin") {
      throw new AppError(403, "Admin access only.");
    }

    next();
  },
);
