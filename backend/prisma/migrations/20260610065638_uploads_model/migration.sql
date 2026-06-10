-- CreateEnum
CREATE TYPE "CompanyRegistrationStatus" AS ENUM ('pending_review', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('pending', 'reviewing', 'accepted', 'rejected');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UploadKind" ADD VALUE 'companyLogo';
ALTER TYPE "UploadKind" ADD VALUE 'companyDocument';

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "document_url" TEXT,
ADD COLUMN     "logo_url" TEXT,
ADD COLUMN     "owner_phone" TEXT,
ADD COLUMN     "pan_vat" TEXT,
ADD COLUMN     "registration_number" TEXT,
ADD COLUMN     "registration_status" "CompanyRegistrationStatus" NOT NULL DEFAULT 'pending_review';

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "gig_id" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pending',
    "cover_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "applications_user_id_idx" ON "applications"("user_id");

-- CreateIndex
CREATE INDEX "applications_gig_id_idx" ON "applications"("gig_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_user_id_gig_id_key" ON "applications"("user_id", "gig_id");

-- CreateIndex
CREATE INDEX "companies_registration_status_idx" ON "companies"("registration_status");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "gigs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
