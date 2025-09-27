import "dotenv/config";

export default {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL,
  NODE_ENV: process.env.NODE_ENV || "development",

  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,

  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,

  SENTRY_DSN: process.env.SENTRY_DSN,

  INGEST_EVENT_KEY: process.env.INGEST_EVENT_KEY,
  INGEST_SECRET_KEY: process.env.INGEST_SECRET_KEY,
};
