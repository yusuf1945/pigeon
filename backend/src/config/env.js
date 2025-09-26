import "dotenv/config";

export default {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/mydatabase",
  NODE_ENV: process.env.NODE_ENV || "development",
};
