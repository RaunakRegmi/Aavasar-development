# Phase 2 Implementation Plan: Gig State Machine

## Goal
Implement a strict state machine for Gig statuses to ensure predictable life-cycle transitions (e.g., preventing a completed gig from being reactivated).

## Tasks

### 1. Status Transition Engine (`backend/src/modules/gigs/gigs.service.ts`)
- [ ] Implement `validateTransition(currentStatus: GigStatus, nextStatus: GigStatus): boolean`.
- [ ] Update `updateGigStatus(gigId: string, nextStatus: GigStatus)` in the service layer:
  - Fetch existing gig.
  - Call `validateTransition`.
  - Throw error if transition is invalid.
  - Update gig status in DB.

### 2. State Constraints Definition
- [ ] Draft allowed transition rules:
  - `draft` → `active` (Requires title, description, pay).
  - `active` → `reviewing` (e.g., after application deadline or recruiter action).
  - `active` → `rejected`.
  - `reviewing` → `completed`.
  - `reviewing` → `rejected`.
  - Terminal states: `completed`, `rejected` (no transitions out).

### 3. API Endpoints (`backend/src/modules/gigs/gigs.routes.ts`)
- [ ] Implement `PATCH /api/gigs/:id/status`.
- [ ] Protect with `requireRecruiter` and `validateGigOwnership` (reusing logic from Phase 1).

## Verification Strategy
- **Unit Testing:**
    - Test all valid transitions (ensure DB updates).
    - Test all invalid transitions (ensure rejection with 400/403).
- **Integration Testing:**
    - Verify that a `draft` gig cannot become `completed` without passing through `active` → `reviewing`.
