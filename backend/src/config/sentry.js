import * as Sentry from "@sentry/node";
import "@sentry/tracing"; // only if you need performance tracing

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Sentry.Integrations.Http({ tracing: true })],
  tracesSampleRate: 1.0, // adjust for production
});
