import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import { CustomAccordion } from '@/components/customComponents/CustomAccordion';
import PageHeader from '@/components/customComponents/PageHeader';
import { FAQS_ITEMS } from './page';

export default function FaqsPage() {
  return (
    <>
      <Breadcrumbs items={[{ title: 'Home', href: '/' }, { title: 'FAQs' }]} />

      <PageHeader
        title='Frequently Asked Questions'
        description='Find answers to the most common questions from our customers.'
        classNames='mt-4'
      />

      <CustomAccordion items={FAQS_ITEMS} />
    </>
  );
}
