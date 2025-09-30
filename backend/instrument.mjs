import * as Sentry from "@sentry/node";
import { ENV } from "./src/config/env.mjs";

Sentry.init({
  dsn: ENV.SENTRY_DSN,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: ENV.NODE_ENV || "development",
  includeLocalVariables: true,
  sendDefaultPii: true,
});
export { Sentry };
