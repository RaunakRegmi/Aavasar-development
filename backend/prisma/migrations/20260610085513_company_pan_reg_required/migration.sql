/*
  Warnings:

  - Made the column `pan_vat` on table `companies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `registration_number` on table `companies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "companies" ALTER COLUMN "pan_vat" SET NOT NULL,
ALTER COLUMN "registration_number" SET NOT NULL;
