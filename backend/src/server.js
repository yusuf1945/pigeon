import express from "express";
import "dotenv/config";
import cors from "cors";
import ENV from "./config/env.js";
import { connectDB } from "./config/db.js";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";

// ✅ Fix Clerk import for ES Modules - using clerk-sdk-node instead
import { createClerkClient } from "@clerk/clerk-sdk-node";

const app = express();
const port = process.env.PORT || 3000;

// Initialize Clerk client
const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Custom auth middleware for ES Modules (remove global auth to avoid 404 issues)
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");
    const session = await clerk.verifyToken(token);
    req.auth = session;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ✅ REMOVED global Clerk middleware - this was causing deployment issues
// Routes
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req, res) => {
  res.send("Hello World 786 - ES Modules Fixed!");
});

// Protected route example
app.get("/protected", requireAuth, (req, res) => {
  res.json({ user: req.auth });
});

// Health check route for Vercel
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();

    // Only listen locally, Vercel will handle the serverless function
    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => console.log(`Server running on ${port}`));
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
