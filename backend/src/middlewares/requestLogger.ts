import pinoHttp from "pino-http";
import { logger } from "@config/logger";

/**
 * `pino-http` logs one structured line per request with method, path,
 * status, duration, and the request id minted by `requestId`. Bind it
 * AFTER `requestId` so the id is available on `req.id`.
 */
export const requestLogger = pinoHttp({
  logger,
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customProps: (req) => ({ requestId: (req as { id?: string }).id }),
  serializers: {
    req(req) {
      // Trim the default to a fraction; full headers go to debug only.
      return { id: req.id, method: req.method, url: req.url };
    },
  },
});
