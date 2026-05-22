import { SITE_NAME } from '@/utils/constants';
import FaqsPage from './FaqsPage';
import { generateMeta } from '@/components/meta/Meta';
import Script from 'next/script';
import { getTranslations } from 'next-intl/server';

export const getFaqsItems = (tFaqs: any, siteName: string) => [
  {
    title: tFaqs('q1_title'),
    content: tFaqs('q1_content', { siteName }),
  },
  {
    title: tFaqs('q2_title'),
    content: tFaqs('q2_content', { siteName }),
  },
  {
    title: tFaqs('q3_title'),
    content: tFaqs('q3_content', { siteName }),
  },
  {
    title: tFaqs('q4_title'),
    content: tFaqs('q4_content', { siteName }),
  },
];

export const metadata = {
  ...generateMeta({
    title: `FAQs | ${SITE_NAME}`,
    description:
      'Answers to common questions about ordering, delivery, and selling on our platform.',
  }),
};

export default async function FAQs() {
  const tFaqs = await getTranslations('QuickLinks.Faqs');
  const faqsItems = getFaqsItems(tFaqs, SITE_NAME);
  return (
    <>
      <Script
        id='faqs-jsonld'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqsItems.map((i) => ({
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
