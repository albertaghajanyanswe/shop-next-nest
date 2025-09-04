-- CreateEnum
CREATE TYPE "public"."EnumProductState" AS ENUM ('NEW', 'USED');

-- AlterTable
ALTER TABLE "public"."product" ADD COLUMN     "oldPrice" DOUBLE PRECISION,
ADD COLUMN     "state" "public"."EnumProductState" NOT NULL DEFAULT 'NEW';
