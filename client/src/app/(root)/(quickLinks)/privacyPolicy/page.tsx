import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import PageHeader from '@/components/customComponents/PageHeader';
import { SITE_NAME } from '@/utils/constants';

export const metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `Learn how ${SITE_NAME} collects, uses, and protects your personal data in compliance with global privacy standards.`,
};

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ title: 'Home', href: '/' }, { title: 'Privacy Policy' }]}
      />

      <PageHeader
        title='Privacy Policy'
        description='Your privacy is important to us. This policy explains how we handle your data.'
        classNames='mt-4'
      />

      <section className='leading-relaxed; space-y-6 text-neutral-600'>
        <p className='text-sm'>
          This Privacy Policy outlines how {SITE_NAME} (“we”, “our”, “us”)
          collects, uses, and protects your personal information when you visit
          or make a purchase from our website.
        </p>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>
          1. Information We Collect
        </h2>
        <p className='text-sm'>We may collect the following categories of personal information:</p>
        <ul className='list-disc pl-6'>
          <li>Contact details (name, email, phone number)</li>
          <li>Order information (billing & shipping details)</li>
          <li>Browsing behavior, analytics data, and device information</li>
          <li>
            Payment details (processed securely via third-party providers)
          </li>
        </ul>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>
          2. How We Use Your Information
        </h2>
        <p className='text-sm'>Your data may be used for:</p>
        <ul className='list-disc pl-6'>
          <li>Order processing and customer support</li>
          <li>Account creation and authentication</li>
          <li>Improving website functionality and shopping experience</li>
          <li>Marketing communications (with your consent)</li>
          <li>Fraud prevention and platform security</li>
        </ul>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>
          3. Cookies & Tracking Technologies
        </h2>
        <p className='text-sm'>
          We use cookies, analytics tools, and similar technologies to
          personalize content, analyze performance, and improve user experience.
          You can modify cookie settings in your browser at any time.
        </p>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>4. Data Sharing</h2>
        <p className='text-sm'>We may share your data only when necessary, including with:</p>
        <ul className='list-disc pl-6'>
          <li>Shipping and delivery partners</li>
          <li>Payment processors</li>
          <li>Analytics and marketing platforms</li>
          <li>Legal authorities when required by law</li>
        </ul>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>
          5. Data Protection & Security
        </h2>
        <p className='text-sm'>
          We implement industry-standard security measures to safeguard your
          personal information. However, no electronic storage or transmission
          is completely secure, and we cannot guarantee absolute protection.
        </p>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>6. Your Rights</h2>
        <p className='text-sm'>You may have the following rights depending on your location:</p>
        <ul className='list-disc pl-6'>
          <li>Access, update, or delete your data</li>
          <li>Opt-out of marketing communications</li>
          <li>Request data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>
          7. International Data Transfers
        </h2>
        <p className='text-sm'>
          If you access our website outside your country, your data may be
          transferred across jurisdictions with different data protection laws.
        </p>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>
          8. Updates to This Policy
        </h2>
        <p className='text-sm'>
          We may revise this Privacy Policy periodically. Updated policies take
          effect upon publication on this page.
        </p>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>9. Contact Us</h2>
        <p className='text-sm'>
          For privacy-related inquiries, contact us at{' '}
          <a
            href='mailto:privacy@mystore.com'
            className='text-blue-600 underline underline-offset-4 hover:text-blue-800'
          >
            privacy@mystore.com
          </a>
          .
        </p>
      </section>
    </>
  );
}
