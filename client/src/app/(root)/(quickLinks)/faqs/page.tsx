import { SITE_NAME } from '@/utils/constants';
import FaqsPage from './FaqsPage';
import { generateMeta } from '@/components/meta/Meta';
import Script from 'next/script';

export const FAQS_ITEMS = [
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
    content: 'Visa, Master',
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
            mainEntity: FAQS_ITEMS.map((i) => ({
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
