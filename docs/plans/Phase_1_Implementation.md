# Phase 1 Implementation Plan: Core Authorization and Gig Creation

## Goal
Establish a secure foundation for gig creation, ensuring recruiters can only post gigs for companies they own or as individuals.

## Tasks

### 1. Authorization Middleware (`backend/src/middlewares/auth.ts` or `backend/src/middlewares/recruiter.ts`)
- [ ] Create a middleware `requireRecruiter` that verifies `req.user.role === 'recruiter'`.
- [ ] Create a middleware `validateCompanyOwnership(companyId)`:
  - Check if the `companyId` exists.
  - Verify `Company.contactUserId === req.user.id`.
  - Ensure `Company.registrationStatus === 'approved'`.

### 2. Gig Creation Logic (`backend/src/modules/gigs/gigs.service.ts`)
- [ ] Define `createGig` function:
  - Accepts `CreateGigDTO`.
  - If `companyId` is provided, call `validateCompanyOwnership`.
  - Sets `postedByUserId` to `req.user.id`.
  - Sets `status` to `draft`.
  - Uses Prisma transaction to insert Gig.

### 3. API Endpoints (`backend/src/modules/gigs/gigs.routes.ts`)
- [ ] Implement `POST /api/gigs` protected by `requireRecruiter`.
- [ ] Ensure proper error handling (e.g., unauthorized access, validation errors).

## Verification Strategy
- **Unit Testing:** Mock the user and company, then attempt to post gigs with:
    - Valid `companyId` (user is owner).
    - Invalid `companyId` (user is not owner).
    - No `companyId` (freelance gig).
- **Manual Verification:** Create a test recruiter user in the dev database, link them to a dummy company, and attempt to post a gig via a tool like `curl` or Postman.
