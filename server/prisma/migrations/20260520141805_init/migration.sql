-- CreateEnum
CREATE TYPE "EnumProductState" AS ENUM ('NEW', 'USED');

-- CreateEnum
CREATE TYPE "billing_period" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "EnumSubscriptionType" AS ENUM ('FREE', 'ADVANCED', 'ADVANCED_ANNUAL', 'PREMIUM', 'PREMIUM_ANNUAL');

-- CreateEnum
CREATE TYPE "subscription_status" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED', 'PENDING', 'PENDING_DOWNGRADE', 'UPGRADING', 'OVERDUE', 'PAUSED', 'TRIALING');

-- CreateEnum
CREATE TYPE "payment_provider" AS ENUM ('STRIPE', 'YOOKASSA');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'REFUNDED', 'EXPIRED', 'PAUSED', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "order_item_status" AS ENUM ('PENDING', 'FAILED', 'REFUNDED', 'CANCELLED', 'CONFIRMED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "currency_enum" AS ENUM ('USD', 'EUR', 'RUB');

-- CreateEnum
CREATE TYPE "EnumRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "EnumProductIntendedFor" AS ENUM ('FREE', 'SALE', 'RENT');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT NOT NULL DEFAULT 'Not Provided',
    "picture" TEXT,
    "country" TEXT,
    "city" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "postal_code" TEXT,
    "username" TEXT,
    "stripe_account_id" TEXT,
    "role" "EnumRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "country" TEXT,
    "city" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "user_id" TEXT,
    "isDefaultStore" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "oldPrice" DOUBLE PRECISION,
    "images" TEXT[],
    "intendedFor" "EnumProductIntendedFor" NOT NULL DEFAULT 'SALE',
    "state" "EnumProductState" NOT NULL DEFAULT 'NEW',
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "totalLikes" INTEGER NOT NULL DEFAULT 0,
    "store_id" TEXT,
    "category_id" TEXT,
    "color_id" TEXT,
    "user_id" TEXT,
    "brand_id" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "isOriginal" BOOLEAN NOT NULL DEFAULT true,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "embedding" JSONB,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_detail" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "product_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "rating" DOUBLE PRECISION,
    "store_id" TEXT,
    "user_id" TEXT,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "rating" DOUBLE PRECISION,
    "store_id" TEXT,
    "user_id" TEXT,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "color" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "store_id" TEXT,

    CONSTRAINT "color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "user_id" TEXT,
    "product_id" TEXT,
    "store_id" TEXT,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan" (
    "id" TEXT NOT NULL,
    "plan_id" "EnumSubscriptionType" NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "period" "billing_period" NOT NULL,
    "store_limit" INTEGER,
    "product_limit" INTEGER,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "stripe_product_id" TEXT NOT NULL,
    "stripe_price_id" TEXT,
    "features" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "stripe_subscription_id" TEXT,
    "status" "subscription_status" NOT NULL DEFAULT 'PENDING',
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "next_billing_date" TIMESTAMP(3),
    "trial_end_at" TIMESTAMP(3),
    "period" "billing_period" NOT NULL,
    "store_limit" INTEGER,
    "product_limit" INTEGER,
    "customer_id" TEXT,
    "user_id" TEXT NOT NULL,
    "plan_id" "EnumSubscriptionType" NOT NULL,
    "next_plan_id" "EnumSubscriptionType",
    "cancelled_at" TIMESTAMP(3),
    "cancelled_reason" JSONB,
    "paused_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "stripe_payment_intent_id" TEXT,
    "stripe_session_id" TEXT,
    "stripe_charge_id" TEXT,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "provider" "payment_provider" NOT NULL,
    "status" "order_status" NOT NULL DEFAULT 'PENDING',
    "external_id" TEXT,
    "provider_meta" JSONB,
    "user_id" TEXT NOT NULL,
    "subscription_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "order_id" TEXT,
    "product_id" TEXT,
    "user_id" TEXT NOT NULL,
    "cachedProductTitle" TEXT,
    "cachedProductImages" TEXT[],
    "status" "order_item_status" NOT NULL DEFAULT 'PENDING',
    "stripe_transfer_id" TEXT,
    "stripe_refund_id" TEXT,
    "stripe_reversal_id" TEXT,
    "transfer_completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "store_id" TEXT,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_info" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT,
    "stripe_default_payment_method" TEXT,
    "stripe_test_clock_id" TEXT,

    CONSTRAINT "billing_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferLog" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "order_item_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "stripe_transfer_id" TEXT,
    "stripe_reversal_id" TEXT,
    "stripe_refund_id" TEXT,
    "gross_amount" DOUBLE PRECISION NOT NULL,
    "transfer_amount" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "error_message" TEXT,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransferLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserFavorites" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserFavorites_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE INDEX "user_id_idx" ON "user"("id");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "store_id_idx" ON "store"("id");

-- CreateIndex
CREATE INDEX "store_title_idx" ON "store"("title");

-- CreateIndex
CREATE INDEX "store_description_idx" ON "store"("description");

-- CreateIndex
CREATE INDEX "product_id_idx" ON "product"("id");

-- CreateIndex
CREATE INDEX "product_title_idx" ON "product"("title");

-- CreateIndex
CREATE INDEX "product_description_idx" ON "product"("description");

-- CreateIndex
CREATE INDEX "product_isPublished_idx" ON "product"("isPublished");

-- CreateIndex
CREATE INDEX "product_detail_value_idx" ON "product_detail"("value");

-- CreateIndex
CREATE UNIQUE INDEX "product_detail_product_id_key_key" ON "product_detail"("product_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE INDEX "category_id_idx" ON "category"("id");

-- CreateIndex
CREATE INDEX "category_name_idx" ON "category"("name");

-- CreateIndex
CREATE INDEX "category_description_idx" ON "category"("description");

-- CreateIndex
CREATE UNIQUE INDEX "brand_name_key" ON "brand"("name");

-- CreateIndex
CREATE INDEX "brand_id_idx" ON "brand"("id");

-- CreateIndex
CREATE INDEX "brand_name_idx" ON "brand"("name");

-- CreateIndex
CREATE INDEX "brand_description_idx" ON "brand"("description");

-- CreateIndex
CREATE UNIQUE INDEX "color_name_key" ON "color"("name");

-- CreateIndex
CREATE INDEX "color_id_idx" ON "color"("id");

-- CreateIndex
CREATE INDEX "color_name_idx" ON "color"("name");

-- CreateIndex
CREATE INDEX "review_id_idx" ON "review"("id");

-- CreateIndex
CREATE INDEX "review_text_idx" ON "review"("text");

-- CreateIndex
CREATE UNIQUE INDEX "plan_plan_id_key" ON "plan"("plan_id");

-- CreateIndex
CREATE INDEX "plan_id_idx" ON "plan"("id");

-- CreateIndex
CREATE INDEX "plan_plan_id_idx" ON "plan"("plan_id");

-- CreateIndex
CREATE INDEX "subscription_id_idx" ON "subscription"("id");

-- CreateIndex
CREATE INDEX "subscription_status_idx" ON "subscription"("status");

-- CreateIndex
CREATE UNIQUE INDEX "order_subscription_id_key" ON "order"("subscription_id");

-- CreateIndex
CREATE INDEX "order_id_idx" ON "order"("id");

-- CreateIndex
CREATE INDEX "order_status_idx" ON "order"("status");

-- CreateIndex
CREATE INDEX "order_item_id_idx" ON "order_item"("id");

-- CreateIndex
CREATE INDEX "order_item_status_idx" ON "order_item"("status");

-- CreateIndex
CREATE UNIQUE INDEX "billing_info_user_id_key" ON "billing_info"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "TransferLog_stripe_transfer_id_key" ON "TransferLog"("stripe_transfer_id");

-- CreateIndex
CREATE INDEX "TransferLog_order_id_idx" ON "TransferLog"("order_id");

-- CreateIndex
CREATE INDEX "TransferLog_order_item_id_idx" ON "TransferLog"("order_item_id");

-- CreateIndex
CREATE INDEX "TransferLog_seller_id_idx" ON "TransferLog"("seller_id");

-- CreateIndex
CREATE INDEX "TransferLog_stripe_transfer_id_idx" ON "TransferLog"("stripe_transfer_id");

-- CreateIndex
CREATE INDEX "TransferLog_status_idx" ON "TransferLog"("status");

-- CreateIndex
CREATE INDEX "TransferLog_createdAt_idx" ON "TransferLog"("createdAt");

-- CreateIndex
CREATE INDEX "_UserFavorites_B_index" ON "_UserFavorites"("B");

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "store_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "color"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_detail" ADD CONSTRAINT "product_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand" ADD CONSTRAINT "brand_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand" ADD CONSTRAINT "brand_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "color" ADD CONSTRAINT "color_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plan"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_next_plan_id_fkey" FOREIGN KEY ("next_plan_id") REFERENCES "plan"("plan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_info" ADD CONSTRAINT "billing_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferLog" ADD CONSTRAINT "TransferLog_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferLog" ADD CONSTRAINT "TransferLog_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferLog" ADD CONSTRAINT "TransferLog_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavorites" ADD CONSTRAINT "_UserFavorites_A_fkey" FOREIGN KEY ("A") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavorites" ADD CONSTRAINT "_UserFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
