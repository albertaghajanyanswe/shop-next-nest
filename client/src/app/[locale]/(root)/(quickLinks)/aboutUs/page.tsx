import { SITE_NAME } from '@/utils/constants';
import { generateMeta } from '@/components/meta/Meta';
import AboutPage from './AboutPage';

export const metadata = generateMeta({
  title: `About Us | ${SITE_NAME}`,
  description: `Learn about our mission, values, and the team behind ${SITE_NAME}.`,
});

export default function About() {
  return <AboutPage />;
}
