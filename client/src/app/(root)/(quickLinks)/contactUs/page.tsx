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
