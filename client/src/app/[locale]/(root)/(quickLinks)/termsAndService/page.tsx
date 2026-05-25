import { SITE_NAME } from '@/utils/constants';
import { generateMeta } from '@/components/meta/Meta';
import TermsPage from './TermsPage';

export const metadata = generateMeta({
  title: `Terms & Service | ${SITE_NAME}`,
  description: `Review the terms and service governing the use of ${SITE_NAME}, including service policies, user responsibilities, and legal compliance.`,
});

export default function Terms() {
  return (
    <>
      <TermsPage />
    </>
  );
}
