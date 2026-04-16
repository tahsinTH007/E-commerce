import mongoose from "mongoose";
import dns from "node:dns/promises";

// Set custom DNS servers to avoid potential DNS resolution issues with MongoDB Atlas
dns.setServers(["1.1.1.1", "8.8.8.8"]);

//connecting to the database
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
