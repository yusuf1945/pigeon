import mongoose from "mongoose";
import ENV from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URL);
    console.log("MongoDB connected at ", ENV.MONGO_URL);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); //Status code 1 indicates error,0 indicates success
  }
};
