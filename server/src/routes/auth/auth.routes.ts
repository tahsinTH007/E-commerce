import { Router } from "express";
import { clerkClient, getAuth } from "@clerk/express";

import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
import { User } from "../../models/User";
import { ok } from "../../utils/envelope";

export const authRouter = Router();

// Route to sync user data from Clerk to our database
authRouter.post(
  "/sync",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    if (!userId) {
      throw new AppError(401, "User is not logged in. Unauthorized");
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    const extractEmailIdFromClerkUser =
      clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId,
      ) || clerkUser.emailAddresses[0];

    const email = extractEmailIdFromClerkUser?.emailAddress;

    const fullName = [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    const name = fullName || clerkUser.username || "Unnamed User";

    const raw = process.env.ADMIN_EMAILS || "";
    const adminEmails = new Set(
      raw
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    );

    const existingUser = await User.findOne({ clerkUserId: userId });
    const shouldBeAdmin = email ? adminEmails.has(email?.toLowerCase()) : false;

    const nextRole =
      existingUser?.role === "admin"
        ? "admin"
        : shouldBeAdmin
          ? "admin"
          : existingUser?.role || "user";

    const newlyCreatedDbUser = await User.findOneAndUpdate(
      { clerkUserId: userId },
      {
        clerkUserId: userId,
        name,
        email,
        role: nextRole,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.status(200).json(
      ok({
        user: {
          id: newlyCreatedDbUser?._id,
          clerkUserId: newlyCreatedDbUser?.clerkUserId,
          name: newlyCreatedDbUser?.name,
          email: newlyCreatedDbUser?.email,
          role: newlyCreatedDbUser?.role,
        },
      }),
    );
  }),
);

// Route to get current authenticated user's info
authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    if (!userId) {
      throw new AppError(401, "User is not logged in. Unauthorized");
    }

    const dbUser = await User.findOne({ clerkUserId: userId });

    if (!dbUser) {
      throw new AppError(404, "User not found in database");
    }

    res.status(200).json(
      ok({
        user: {
          id: dbUser._id,
          clerkUserId: dbUser.clerkUserId,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          points: dbUser.points,
        },
      }),
    );
  }),
);
