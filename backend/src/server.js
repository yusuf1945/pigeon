import express from "express";
import "dotenv/config";
import cors from "cors";
import ENV from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/clerk-sdk-node";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";

const app = express();
app.use(cors());
const PORT = ENV.PORT;

app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.get("/", (req, res) => {
  res.send("Hello World 786");
});

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   connectDB();
// });

const startServer = async () => {
  try {
    await connectDB();
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // Exit the process with an error code
  }
};

startServer();
export default app;
