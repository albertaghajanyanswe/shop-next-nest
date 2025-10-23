import { BillingInfo } from '@prisma/client';

export interface StripeData {
  customerId: string;
  defaultPaymentMethod: string;
}

export type BillingInfoWithStripe = Omit<BillingInfo, 'serviceData'> & {
  serviceData: StripeData;
};

export function excludeFields<T>(model: T, exclude: (keyof T)[]): Record<string, boolean> {
  const select: Record<string, boolean> = {};
  for (const key in model) {
    select[key] = !exclude.includes(key as keyof T);
  }
  return select;
}
