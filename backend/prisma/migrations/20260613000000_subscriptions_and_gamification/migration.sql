-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('basic', 'professional', 'enterprise');

-- AlterEnum
ALTER TYPE "NotificationKind" ADD VALUE 'points_awarded';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "current_period_end" TIMESTAMP(3),
ADD COLUMN     "extra_gig_slots" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "featured_until" TIMESTAMP(3),
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stripe_customer_id" TEXT,
ADD COLUMN     "subscription_status" TEXT,
ADD COLUMN     "subscription_tier" "SubscriptionTier" NOT NULL DEFAULT 'basic';

-- CreateTable
CREATE TABLE "points_transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "gig_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "points_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perk_redemptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "perk_key" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perk_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "points_transactions_user_id_created_at_idx" ON "points_transactions"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "perk_redemptions_user_id_created_at_idx" ON "perk_redemptions"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- AddForeignKey
ALTER TABLE "points_transactions" ADD CONSTRAINT "points_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perk_redemptions" ADD CONSTRAINT "perk_redemptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

