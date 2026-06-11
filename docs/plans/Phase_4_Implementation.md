# Phase 4 Implementation Plan: Lifecycle, Notifications, and UX

## Goal
Close the loop by adding asynchronous notifications, search functionality, and finalizing the frontend UX to make the system feel production-ready.

## Tasks

### 1. Notification/Event System
- [ ] Define event emitters for `ApplicationCreated`, `ApplicationAccepted`, `ApplicationRejected`.
- [ ] Create basic notification service (can initially log to console/DB, to be expanded to email/push).
- [ ] Wire service calls into existing application/gig services.

### 2. Search & Discovery
- [ ] Optimize `GET /api/gigs` with `Prisma` filters:
  - `where`: `status: 'active'`, `title: { contains: query }`, `location`, `payKind`.
  - Implement pagination.

### 3. Frontend UX Completion
- [ ] **Student:** Build `GigDetailView` and `ApplicationFlow`.
- [ ] **Recruiter:** Build `RecruiterDashboard` (list gigs) and `ApplicantTracker` (manage applications).

## Verification Strategy
- **Manual QA:** End-to-end walkthrough of all user flows.
- **E2E Testing (Optional/Stretch):** Use a tool like Cypress or Playwright for key journeys (Posting a gig, applying, accepting).
