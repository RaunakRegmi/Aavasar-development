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

import { MessageRepository } from "@modules/messaging/message.repository";
import { MessageService } from "@modules/messaging/message.service";
import { MessageController } from "@modules/messaging/message.controller";

import { DashboardRepository } from "@modules/dashboard/dashboard.repository";
import { DashboardService } from "@modules/dashboard/dashboard.service";
import { DashboardController } from "@modules/dashboard/dashboard.controller";

import { BillingRepository } from "@modules/billing/billing.repository";
import { BillingService } from "@modules/billing/billing.service";
import { BillingController } from "@modules/billing/billing.controller";

import { RewardsRepository } from "@modules/rewards/rewards.repository";
import { RewardsService } from "@modules/rewards/rewards.service";
import { RewardsController } from "@modules/rewards/rewards.controller";

import { ContactService } from "@modules/contact/contact.service";
import { ContactController } from "@modules/contact/contact.controller";

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

  messageRepo: MessageRepository;
  messageService: MessageService;
  messageController: MessageController;

  dashboardRepo: DashboardRepository;
  dashboardService: DashboardService;
  dashboardController: DashboardController;

  billingRepo: BillingRepository;
  billingService: BillingService;
  billingController: BillingController;

  rewardsRepo: RewardsRepository;
  rewardsService: RewardsService;
  rewardsController: RewardsController;

  contactService: ContactService;
  contactController: ContactController;
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
  const billingRepo = overrides.billingRepo ?? new BillingRepository(db);
  const rewardsRepo = overrides.rewardsRepo ?? new RewardsRepository(db);

  const notificationService = overrides.notificationService ?? new NotificationService(notificationRepo);
  const rewardsService = overrides.rewardsService ?? new RewardsService(rewardsRepo, notificationService);
  const authService = overrides.authService ?? new AuthService(userRepo, authRepo);
  const gigService = overrides.gigService ?? new GigService(gigRepo, billingRepo, rewardsService);
  const uploadService = overrides.uploadService ?? new UploadService(uploadRepo, userRepo);
  const meService = overrides.meService ?? new MeService(meRepo);
  const appService = overrides.appService ?? new ApplicationService(appRepo, notificationService, billingRepo);
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

  const messageRepo = overrides.messageRepo ?? new MessageRepository(db);
  const messageService =
    overrides.messageService ?? new MessageService(messageRepo, userRepo, notificationService);
  const messageController = overrides.messageController ?? new MessageController(messageService);

  const dashboardRepo = overrides.dashboardRepo ?? new DashboardRepository(db);
  const dashboardService = overrides.dashboardService ?? new DashboardService(dashboardRepo);
  const dashboardController = overrides.dashboardController ?? new DashboardController(dashboardService);

  const billingService = overrides.billingService ?? new BillingService(billingRepo);
  const billingController = overrides.billingController ?? new BillingController(billingService);

  const rewardsController = overrides.rewardsController ?? new RewardsController(rewardsService);

  const contactService = overrides.contactService ?? new ContactService();
  const contactController = overrides.contactController ?? new ContactController(contactService);

  return {
    db,
    userRepo, authRepo, gigRepo, uploadRepo, meRepo, appRepo, companyRepo, notificationRepo,
    notificationService, authService, gigService, uploadService, meService, appService, companyService, talentService,
    authController, gigController, uploadController, meController, appController, companyController, talentController, notificationController,
    messageRepo, messageService, messageController,
    dashboardRepo, dashboardService, dashboardController,
    billingRepo, billingService, billingController,
    rewardsRepo, rewardsService, rewardsController,
    contactService, contactController,
  };
}
