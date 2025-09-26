import express from "express";
import "dotenv/config";
import cors from "cors";
const app = express();
app.use(cors());
import ENV from "./config/env.js";
const PORT = ENV.PORT;

app.get("/", (req, res) => {
  res.send("Hello World 786");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
