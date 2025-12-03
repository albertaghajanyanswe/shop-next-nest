import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import { CustomAccordion } from '@/components/customComponents/CustomAccordion';
import PageHeader from '@/components/customComponents/PageHeader';
import { SITE_NAME } from '@/utils/constants';
import Script from 'next/script';

const items = [
  {
    title: 'How long does shipping take?',
    content: '3–7 business days on average.',
  },
  {
    title: 'What is your return policy?',
    content: '14 days money-back guarantee.',
  },
  {
    title: 'What payment methods do you accept?',
    content:
      'Visa, Masterp-6 rounded-xl border bg-white shadow-sm transition hover:shadow-md, PayPal, Apple Pay.',
  },
];

export default function FaqsPage() {
  return (
    <>
      <Breadcrumbs items={[{ title: 'Home', href: '/' }, { title: 'FAQs' }]} />

      <PageHeader
        title='Frequently Asked Questions'
        description='Find answers to the most common questions from our customers.'
        classNames='mt-4'
      />

      <CustomAccordion items={items} />
    </>
  );
}
