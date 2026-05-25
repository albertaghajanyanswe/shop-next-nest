import { SITE_NAME } from '@/utils/constants';
import { generateMeta } from '@/components/meta/Meta';
import ContactUsPage from './ContactUsPage';

export const metadata = generateMeta({
  title: `Contact Us | ${SITE_NAME}`,
  description: `Send your questions to our support team.`,
});

export default function ContactUs() {
  return (
    <>
      <ContactUsPage />
    </>
  );
}
