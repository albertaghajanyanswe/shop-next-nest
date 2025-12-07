import { SITE_NAME } from '@/utils/constants';
import AboutPage from './AboutPage';

export const metadata = {
  title: `About Us | ${SITE_NAME}`,
  description: `Learn about our mission, values, and the team behind ${SITE_NAME}.`,
};

export default function About() {
  return <AboutPage />;
}
