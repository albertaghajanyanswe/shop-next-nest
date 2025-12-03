import { SITE_NAME } from '@/utils/constants';
import TermsPage from './TermsPage';

export const metadata = {
  title: `Terms & Conditions | ${SITE_NAME}`,
  description: `Review the terms and conditions governing the use of ${SITE_NAME}, including service policies, user responsibilities, and legal compliance.`,
};

export default function Terms() {
  return (
    <>
      <TermsPage />
    </>
  );
}
