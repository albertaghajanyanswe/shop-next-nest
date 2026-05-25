import { SITE_NAME } from '@/utils/constants';
import { generateMeta } from '@/components/meta/Meta';
import PrivacyPage from './PrivacyPage';

export const metadata = generateMeta({
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `Learn how ${SITE_NAME} collects, uses, and protects your personal data in compliance with global privacy standards.`,
});

export default function Privacy() {
  return (
    <>
      <PrivacyPage />
    </>
  );
}
