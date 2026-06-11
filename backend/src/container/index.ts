/**
 * Composition root — the single place where concrete dependencies
 * (PrismaClient, repositories, services, controllers) are instantiated
 * and wired together.
 *
 * Everything else in the codebase takes its dependencies via constructor
 * arguments. That gives us:
 *   • Testability — replace any leaf with a fake (`makeContainer({ db: fakeDb })`)
 *   • Clarity     — one file shows the full dependency graph
 *   • No magic    — no DI framework, no decorator metadata, just functions
 */
import type { PrismaClient } from "@prisma/client";
import { prisma as defaultPrisma } from "@config/prisma";

import { UserRepository } from "@modules/users/user.repository";
import { AuthRepository } from "@modules/auth/auth.repository";
import { AuthService } from "@modules/auth/auth.service";
import { AuthController } from "@modules/auth/auth.controller";

import { GigRepository } from "@modules/gigs/gig.repository";
import { GigService } from "@modules/gigs/gig.service";
import { GigController } from "@modules/gigs/gig.controller";

import { UploadRepository } from "@modules/uploads/upload.repository";
import { UploadService } from "@modules/uploads/upload.service";
import { UploadController } from "@modules/uploads/upload.controller";

import { MeRepository } from "@modules/me/me.repository";
import { MeService } from "@modules/me/me.service";
import { MeController } from "@modules/me/me.controller";

import { ApplicationRepository } from "@modules/applications/application.repository";
import { ApplicationService } from "@modules/applications/application.service";
import { ApplicationController } from "@modules/applications/application.controller";

import { CompanyRepository } from "@modules/companies/company.repository";
import { CompanyService } from "@modules/companies/company.service";
import { CompanyController } from "@modules/companies/company.controller";

import { NotificationRepository } from "@modules/notifications/notification.repository";
import { NotificationService } from "@modules/notifications/notification.service";
import { NotificationController } from "@modules/notifications/notification.controller";

import { TalentService } from "@modules/users/talent.service";
import { TalentController } from "@modules/users/talent.controller";

export interface Container {
  db: PrismaClient;
  userRepo: UserRepository;
  authRepo: AuthRepository;
  gigRepo: GigRepository;
  uploadRepo: UploadRepository;
  meRepo: MeRepository;
  appRepo: ApplicationRepository;
  companyRepo: CompanyRepository;
  notificationRepo: NotificationRepository;

  notificationService: NotificationService;
  authService: AuthService;
  gigService: GigService;
  uploadService: UploadService;
  meService: MeService;
  appService: ApplicationService;
  companyService: CompanyService;
  talentService: TalentService;

  authController: AuthController;
  gigController: GigController;
  uploadController: UploadController;
  meController: MeController;
  appController: ApplicationController;
  companyController: CompanyController;
  talentController: TalentController;
  notificationController: NotificationController;
}

export type ContainerOverrides = Partial<Container>;

export function makeContainer(overrides: ContainerOverrides = {}): Container {
  const db = overrides.db ?? defaultPrisma;

  const userRepo = overrides.userRepo ?? new UserRepository(db);
  const authRepo = overrides.authRepo ?? new AuthRepository(db);
  const gigRepo = overrides.gigRepo ?? new GigRepository(db);
  const uploadRepo = overrides.uploadRepo ?? new UploadRepository(db);
  const meRepo = overrides.meRepo ?? new MeRepository(db);
  const appRepo = overrides.appRepo ?? new ApplicationRepository(db);
  const companyRepo = overrides.companyRepo ?? new CompanyRepository(db);
  const notificationRepo = overrides.notificationRepo ?? new NotificationRepository(db);

  const notificationService = overrides.notificationService ?? new NotificationService(notificationRepo);
  const authService = overrides.authService ?? new AuthService(userRepo, authRepo);
  const gigService = overrides.gigService ?? new GigService(gigRepo);
  const uploadService = overrides.uploadService ?? new UploadService(uploadRepo, userRepo);
  const meService = overrides.meService ?? new MeService(meRepo);
  const appService = overrides.appService ?? new ApplicationService(appRepo, notificationService);
  const companyService = overrides.companyService ?? new CompanyService(companyRepo);
  const talentService = overrides.talentService ?? new TalentService(userRepo);

  const authController = overrides.authController ?? new AuthController(authService);
  const gigController = overrides.gigController ?? new GigController(gigService);
  const uploadController = overrides.uploadController ?? new UploadController(uploadService);
  const meController = overrides.meController ?? new MeController(meService, authService);
  const appController = overrides.appController ?? new ApplicationController(appService);
  const companyController = overrides.companyController ?? new CompanyController(companyService);
  const talentController = overrides.talentController ?? new TalentController(talentService);
  const notificationController = overrides.notificationController ?? new NotificationController(notificationService);

  return {
    db,
    userRepo, authRepo, gigRepo, uploadRepo, meRepo, appRepo, companyRepo, notificationRepo,
    notificationService, authService, gigService, uploadService, meService, appService, companyService, talentService,
    authController, gigController, uploadController, meController, appController, companyController, talentController, notificationController,
  };
}
