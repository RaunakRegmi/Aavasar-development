/**
 * Upload routes — `/uploads/*` — all require an authenticated user.
 *
 *   POST /uploads/avatar         multipart/form-data, field `file`, max 2 MB
 *   POST /uploads/portfolio      multipart/form-data, field `file`, max 10 MB (PDF)
 *   POST /uploads/attachment     multipart/form-data, field `file`, max 10 MB
 *
 * Why these are three distinct endpoints (and not one `/uploads?kind=...`):
 * size + MIME caps differ per kind and we want the multer middleware
 * to fail fast at the network boundary, not deep in the service.
 */
import { Router } from "express";
import { requireAuth } from "@middlewares/auth";
import { asyncHandler } from "@lib/async";
import { makeUploadMiddleware } from "@lib/upload";
import type { UploadController } from "./upload.controller";

export function makeUploadRouter(controller: UploadController): Router {
  const router = Router();

  router.post(
    "/avatar",
    requireAuth,
    makeUploadMiddleware("avatar"),
    asyncHandler(controller.uploadAvatar),
  );

  router.post(
    "/portfolio",
    requireAuth,
    makeUploadMiddleware("portfolio"),
    asyncHandler(controller.uploadPortfolio),
  );

  router.post(
    "/banner",
    requireAuth,
    makeUploadMiddleware("banner"),
    asyncHandler(controller.uploadBanner),
  );

  router.post(
    "/nid",
    requireAuth,
    makeUploadMiddleware("nid"),
    asyncHandler(controller.uploadNid),
  );

  router.post(
    "/attachment",
    requireAuth,
    makeUploadMiddleware("attachment"),
    asyncHandler(controller.uploadAttachment),
  );

  router.post(
    "/company-logo",
    requireAuth,
    makeUploadMiddleware("companyLogo"),
    asyncHandler(controller.uploadCompanyLogo),
  );

  router.post(
    "/company-document",
    requireAuth,
    makeUploadMiddleware("companyDocument"),
    asyncHandler(controller.uploadCompanyDocument),
  );

  return router;
}
