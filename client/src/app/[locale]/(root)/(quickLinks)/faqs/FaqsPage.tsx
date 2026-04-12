import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import { CustomAccordion } from '@/components/customComponents/CustomAccordion';
import PageHeader from '@/components/customComponents/PageHeader';
import { getFaqsItems } from './page';
import { useTranslations } from 'next-intl';

export default function FaqsPage() {
  const tFaqs = useTranslations('QuickLinks.Faqs');
  const tCommon = useTranslations('HeaderMenu');
  const faqsItems = getFaqsItems(tFaqs);

  return (
    <>
      <Breadcrumbs
        items={[
          { title: tCommon('Home'), href: '/' },
          { title: tFaqs('title') },
        ]}
      />

      <PageHeader
        title={tFaqs('title')}
        description={tFaqs('description')}
        classNames='mt-4'
      />

      <CustomAccordion items={faqsItems} />
    </>
  );
}
