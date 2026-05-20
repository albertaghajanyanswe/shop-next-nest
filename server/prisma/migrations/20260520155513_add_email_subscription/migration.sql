-- CreateTable
CREATE TABLE "email_subscription" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "email_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_subscription_email_key" ON "email_subscription"("email");

-- CreateIndex
CREATE INDEX "email_subscription_email_idx" ON "email_subscription"("email");

-- CreateIndex
CREATE INDEX "email_subscription_is_active_idx" ON "email_subscription"("is_active");
