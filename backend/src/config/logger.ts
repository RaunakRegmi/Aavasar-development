/**
 * Pino logger — structured JSON to stdout.
 *
 * Why JSON: ELK / Datadog / Splunk all expect one JSON object per line.
 * Avoid `console.log` outside of this module — it bypasses redaction
 * and breaks log shipping.
 *
 * For prettier dev output: `npm i -D pino-pretty` then pipe:
 *     npm run dev | npx pino-pretty
 * Keeping the transport out of the runtime config means a missing
 * `pino-pretty` package doesn't crash boot.
 */
import pino from "pino";
import { env } from "./env";

export const logger = pino({
  level: env.logLevel,
  // PII-safe redaction. Add fields here, not at call sites.
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.body.password",
      "req.body.confirmPassword",
      "req.body.token",
      "user.passwordHash",
    ],
    censor: "[REDACTED]",
  },
});

export type Logger = typeof logger;
