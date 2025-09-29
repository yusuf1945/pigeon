import express from "express";
import "dotenv/config";
import cors from "cors";
import ENV from "./config/env.js";
import { connectDB } from "./config/db.js";
import { ClerkExpressRequireAuth, clerkClient } from "@clerk/express"; // ESM style
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Apply Clerk middleware globally
app.use(ClerkExpressRequireAuth());

// Routes
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req, res) => {
  res.send("Hello World 786");
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`Server running on ${port}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
