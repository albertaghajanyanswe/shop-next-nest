import { SITE_NAME } from '@/utils/constants';
import { generateMeta } from '@/components/meta/Meta';
import HowItWorksPage from './HowItWorksPage';

export const metadata = generateMeta({
  title: `How it works | ${SITE_NAME}`,
  description: `Learn about our mission, values, and the team behind ${SITE_NAME}.`,
});

export default function HowItWorks() {
  return <HowItWorksPage />;
}
