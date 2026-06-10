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

export interface ContainerOverrides {
  db?: PrismaClient;
}

export interface Container {
  db: PrismaClient;

  userRepo: UserRepository;
  authRepo: AuthRepository;
  gigRepo: GigRepository;
  uploadRepo: UploadRepository;
  meRepo: MeRepository;
  appRepo: ApplicationRepository;
  companyRepo: CompanyRepository;

  authService: AuthService;
  gigService: GigService;
  uploadService: UploadService;
  meService: MeService;
  appService: ApplicationService;
  companyService: CompanyService;

  authController: AuthController;
  gigController: GigController;
  uploadController: UploadController;
  meController: MeController;
  appController: ApplicationController;
  companyController: CompanyController;
}

export function makeContainer(overrides: ContainerOverrides = {}): Container {
  const db = overrides.db ?? defaultPrisma;

  const userRepo = new UserRepository(db);
  const authRepo = new AuthRepository(db);
  const gigRepo = new GigRepository(db);
  const uploadRepo = new UploadRepository(db);
  const meRepo = new MeRepository(db);
  const appRepo = new ApplicationRepository(db);
  const companyRepo = new CompanyRepository(db);

  const authService = new AuthService(userRepo, authRepo);
  const gigService = new GigService(gigRepo);
  const uploadService = new UploadService(uploadRepo, userRepo);
  const meService = new MeService(meRepo);
  const appService = new ApplicationService(appRepo);
  const companyService = new CompanyService(companyRepo);

  const authController = new AuthController(authService);
  const gigController = new GigController(gigService);
  const uploadController = new UploadController(uploadService);
  const meController = new MeController(meService, authService);
  const appController = new ApplicationController(appService);
  const companyController = new CompanyController(companyService);

  return {
    db,
    userRepo, authRepo, gigRepo, uploadRepo, meRepo, appRepo, companyRepo,
    authService, gigService, uploadService, meService, appService, companyService,
    authController, gigController, uploadController, meController, appController, companyController,
  };
}
