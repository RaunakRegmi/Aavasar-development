/**
 * Password hashing — bcryptjs with a cost factor of 12.
 *
 * Pure JS implementation (no native bindings) so the image builds
 * cleanly on Alpine + ARM CI runners. If we ever need argon2 (memory-
 * hard parameters), swap here — call sites remain identical.
 */
import bcrypt from "bcryptjs";

const COST = 12;

export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, COST);
}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}
