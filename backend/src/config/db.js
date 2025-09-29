import mongoose from "mongoose";
import "dotenv/config"; // ✅ Import dotenv directly instead of ENV

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    // ✅ Use DATABASE_URL for Vercel compatibility, fallback to MONGO_URL
    const dbUrl = process.env.DATABASE_URL || process.env.MONGO_URL;

    if (!dbUrl) {
      throw new Error("No database URL found in environment variables");
    }

    const db = await mongoose.connect(dbUrl, {
      // ✅ Add connection options for better stability
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("DB connection failed:", err.message);
    throw err;
  }
};

// ✅ Export as both named and default for flexibility
export default connectDB;
