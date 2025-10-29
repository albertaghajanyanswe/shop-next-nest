import { EnumOrderStatus } from "@prisma/client";

export interface PaymentWebhookResult {
  orderId: string;
  planId: string;
  paymentId: string;
  status: EnumOrderStatus;
  raw: object;
}