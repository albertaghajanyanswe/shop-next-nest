import { Metadata } from 'next';
import { productService } from '@/services/product.service';
import BillingResult from './BillingResult';

export const metadata: Metadata = {
  title: 'Billing result',
};

export const revalidate = 60;

export default async function BillingResultPage() {
  return <BillingResult />;
}
