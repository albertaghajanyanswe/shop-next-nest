import { SITE_NAME } from '@/utils/constants';
import FaqsPage from './FaqsPage';
import { generateMeta } from '@/components/meta/Meta';
import Script from 'next/script';

const items = [
  {
    title: 'How long does shipping take?',
    content: '3-7 business days on average.',
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

export const metadata = {
  ...generateMeta({
    title: `FAQs | ${SITE_NAME}`,
    description:
      'Answers to common questions about orders, returns, and support.',
  }),
};

export default function FAQs() {
  return (
    <>
      <Script
        id='faqs-jsonld'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((i) => ({
              '@type': 'Question',
              name: i.title,
              acceptedAnswer: { '@type': 'Answer', text: i.content },
            })),
          }),
        }}
      />

      <FaqsPage />
    </>
  );
}
