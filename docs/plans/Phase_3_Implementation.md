# Phase 3 Implementation Plan: Application Engine

## Goal
Enable students to apply for gigs and allow recruiters to manage the incoming talent pipeline.

## Tasks

### 1. Application Service (`backend/src/modules/applications/applications.service.ts`)
- [ ] Implement `applyToGig(userId: string, gigId: string, coverNote?: string)`:
  - Check if `Gig` status is `active`.
  - Validate applicant `onboardingCompleted`.
  - Prevent duplicate applications (using Prisma unique constraint).
- [ ] Implement `listApplications(gigId: string, recruiterId: string)`:
  - Verify recruiter owns the gig.
  - Paginate results.
- [ ] Implement `updateApplicationStatus(applicationId: string, status: ApplicationStatus, recruiterId: string)`:
  - Ensure recruiter owns the gig linked to the application.
  - Update status.

### 2. API Endpoints (`backend/src/modules/applications/applications.routes.ts`)
- [ ] `POST /api/gigs/:id/apply` (protected by `requireStudent`).
- [ ] `GET /api/gigs/:id/applications` (protected by `requireRecruiter`).
- [ ] `PATCH /api/applications/:id/status` (protected by `requireRecruiter`).

## Verification Strategy
- **Unit Testing:**
  - Verify application creation logic.
  - Test duplicate application rejection.
- **Integration Testing:**
  - Full flow: Student applies → Recruiter sees application → Recruiter accepts → Student application status updates.
