import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import PageHeader from '@/components/customComponents/PageHeader';
import { SITE_NAME } from '@/utils/constants';
import ContactUsPage from './ContactUsPage';

export const metadata = {
  title: `Contact Us | ${SITE_NAME}`,
  description: `Send your questions to our support team.`,
};

export default function ContactUs() {
  return (
    <>
      <ContactUsPage />
    </>
  );
}
