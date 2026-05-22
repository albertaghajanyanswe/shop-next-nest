import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import BillingResult from './BillingResult';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Billing');
  return { title: t('page_title') };
}

export default async function BillingResultPage() {
  return <BillingResult />;
}
