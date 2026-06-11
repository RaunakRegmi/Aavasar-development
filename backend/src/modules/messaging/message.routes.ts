import { Router } from "express";
import { validate } from "@middlewares/validate";
import { requireAuth } from "@middlewares/auth";
import { asyncHandler } from "@lib/async";
import {
  ConversationIdParamsSchema,
  ListMessagesQuerySchema,
  SendMessageRequestSchema,
  StartConversationRequestSchema,
} from "./message.contracts";
import type { MessageController } from "./message.controller";

export function makeMessageRouter(controller: MessageController): Router {
  const router = Router();

  // Recruiter-initiated (role enforced in the service).
  router.post(
    "/",
    requireAuth,
    validate({ body: StartConversationRequestSchema }),
    asyncHandler(controller.start),
  );

  router.get("/", requireAuth, asyncHandler(controller.list));

  router.get(
    "/:id/messages",
    requireAuth,
    validate({ params: ConversationIdParamsSchema, query: ListMessagesQuerySchema }),
    asyncHandler(controller.messages),
  );

  router.post(
    "/:id/messages",
    requireAuth,
    validate({ params: ConversationIdParamsSchema, body: SendMessageRequestSchema }),
    asyncHandler(controller.send),
  );

  router.post(
    "/:id/read",
    requireAuth,
    validate({ params: ConversationIdParamsSchema }),
    asyncHandler(controller.read),
  );

  return router;
}
