import { Router } from "express";
import { requireAuth } from "@middlewares/auth";
import { asyncHandler } from "@lib/async";
import type { NotificationController } from "./notification.controller";

export function makeNotificationRouter(controller: NotificationController): Router {
  const router = Router();

  router.get("/", requireAuth, asyncHandler(controller.list));

  router.post("/mark-all-read", requireAuth, asyncHandler(controller.markAllRead));

  return router;
}
