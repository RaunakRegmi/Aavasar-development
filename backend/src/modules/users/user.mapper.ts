/**
 * Mapper — Prisma `User` row → public `SessionUser` DTO.
 *
 * Drops `passwordHash`, `tokenVersion`, and any internal field. If
 * the frontend contract changes (see frontend/src/features/auth/
 * contracts/auth.contract.ts), update here too.
 */
import type { User } from "@prisma/client";

export interface SessionUserDto {
  id: string;
  email: string;
  fullName: string;
  role: "student" | "recruiter" | "admin";
  avatarUrl?: string;
  bannerUrl?: string;
  headline?: string;
  bio?: string;
  skills: string[];
  onboardingCompleted: boolean;
  verified: boolean;
}

export function toSessionUser(u: User): SessionUserDto {
  return {
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    role: u.role,
    ...(u.avatarUrl ? { avatarUrl: u.avatarUrl } : {}),
    ...(u.bannerUrl ? { bannerUrl: u.bannerUrl } : {}),
    ...(u.headline ? { headline: u.headline } : {}),
    ...(u.bio ? { bio: u.bio } : {}),
    skills: u.skills,
    onboardingCompleted: u.onboardingCompleted,
    verified: u.verified,
  };
}
