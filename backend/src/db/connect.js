import mongoose from "mongoose";
import { config } from "dotenv";

export default async function connect() {
  config();
  const uri = process.env.MONGO_URL || "mongodb://localhost:27017/Task-Manager";

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connection successful.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}
