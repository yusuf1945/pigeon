import express from "express";
import "dotenv/config";
import cors from "cors";
import ENV from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();
app.use(cors());
const PORT = ENV.PORT;

app.get("/", (req, res) => {
  res.send("Hello World 786");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
