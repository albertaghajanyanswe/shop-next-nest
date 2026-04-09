import { Metadata } from 'next';
import BillingResult from './BillingResult';

export const metadata: Metadata = {
  title: 'Billing result',
};

export default async function BillingResultPage() {
  return <BillingResult />;
}
