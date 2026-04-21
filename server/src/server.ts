import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFound";
import { connectDB } from "./db";
import { ok } from "./utils/envelope";
import { authRouter } from "./routes/auth/auth.routes";
import { clerkMiddleware } from "@clerk/express";
import { adminProductRouter } from "./routes/admin/product.routes";
import { initCloudinary } from "./utils/cloudinary";
import { customerProductRouter } from "./routes/customer/product.routes";
import { customerAddressRouter } from "./routes/customer/address.routes";
import { adminPromoRouter } from "./routes/admin/promo.routes";
import { customerPromoRouter } from "./routes/customer/promo.routes";

// Main entry point of the server application
async function mainEntryFunction() {
  // Connect to the database before starting the server
  await connectDB();

  const app = express();

  initCloudinary();

  // Configure CORS to allow requests from specified origins
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];

  app.use(cors({ origin: corsOrigins, credentials: true }));
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(clerkMiddleware());

  app.get("/health", (_req, res) => {
    res.status(200).json(ok({ message: "Server is healthy" }));
  });

  // Register application routes
  app.use("/auth", authRouter);

  // admin
  app.use("/admin", [adminProductRouter, adminPromoRouter]);

  // customer
  app.use("/customer", [
    customerProductRouter,
    customerAddressRouter,
    customerPromoRouter,
  ]);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

mainEntryFunction().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
