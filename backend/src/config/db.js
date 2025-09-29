import mongoose from "mongoose";
import ENV from "./env.js";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(process.env.MONGO_URL);
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection failed:", err);
    throw err;
  }
};
export default connectDB;
