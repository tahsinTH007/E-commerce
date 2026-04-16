import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFound";
import { connectDB } from "./db";
import { ok } from "./utils/envelope";

async function mainEntryFunction() {
  await connectDB();
  const app = express();

  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];
  app.use(cors({ origin: corsOrigins, credentials: true }));

  app.use(express.json());

  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.status(200).json(ok({ message: "Server is healthy" }));
  });

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
