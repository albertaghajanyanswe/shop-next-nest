import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import PageHeader from '@/components/customComponents/PageHeader';
import { SITE_NAME } from '@/utils/constants';

export const metadata = {
  title: `Terms & Conditions | ${SITE_NAME}`,
  description: `Review the terms and conditions governing the use of ${SITE_NAME}, including service policies, user responsibilities, and legal compliance.`,
};

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ title: 'Home', href: '/' }, { title: 'Terms & Conditions' }]}
      />

      <PageHeader
        title='Terms & Conditions'
        description='Please read these terms carefully before using our services.'
        classNames='mt-4'
      />

      <section className='leading-relaxed; space-y-2 text-neutral-600'>
        <p className='text-sm'>
          Welcome to {SITE_NAME}. By accessing or using our website, products,
          or services, you agree to comply with the following Terms &
          Conditions. If you do not agree with any part of these terms, please
          discontinue use of our website.
        </p>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>1. Use of Website</h2>
        <p className='text-sm'>
          You agree to use this website only for lawful purposes and in a manner
          that does not infringe the rights of others or restrict their use of
          the site. Unauthorized attempts to access our servers, interfere with
          platform functionality, or misuse our services are strictly
          prohibited.
        </p>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>
          2. Account Registration
        </h2>
        <p className='text-sm'>
          When creating an account, you agree to provide accurate, complete, and
          up-to-date information. You are responsible for maintaining the
          confidentiality of your login credentials and for all activities
          performed under your account.
        </p>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>
          3. Orders & Payments
        </h2>
        <p className='text-sm'>
          All orders placed on the platform are subject to acceptance and
          availability. Pricing, product descriptions, and inventory may change
          without notice. We reserve the right to cancel orders due to suspected
          fraud, incorrect pricing, or supply shortages.
        </p>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>
          4. Shipping & Delivery
        </h2>
        <p className='text-sm'>
          Delivery times are estimates only. We are not responsible for delays
          caused by couriers, customs, weather conditions, or other
          circumstances beyond our control.
        </p>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>
          5. Returns & Refunds
        </h2>
        <p className='text-sm'>
          Customers may return eligible items within the specified return
          window. Items must be in original condition unless defective or
          damaged. Refunds are processed via the original payment method.
        </p>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>
          6. Intellectual Property
        </h2>
        <p className='text-sm'>
          All content on our website—including text, graphics, logos, images,
          and code—is the property of {SITE_NAME} or its licensors and is
          protected by international copyright laws.
        </p>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>
          7. Limitation of Liability
        </h2>
        <p className='text-sm'>
          {SITE_NAME} is not liable for any indirect, incidental, special, or
          consequential damages arising from the use of our platform, even if we
          have been advised of such possibilities.
        </p>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>
          8. Changes to Terms
        </h2>
        <p className='text-sm'>
          We may update these Terms & Conditions periodically. Continued use of
          the website after changes are published constitutes acceptance of the
          updated terms.
        </p>

        <h2 className='mt-4 mb-3 text-xl text-neutral-900 font-semibold'>9. Contact Us</h2>
        <p className='text-sm'>
          If you have any questions regarding these Terms & Conditions, contact
          us at{' '}
          <a
            href='mailto:support@mystore.com'
            className='text-blue-600 underline underline-offset-4 hover:text-blue-800'
          >
            support@mystore.com
          </a>
          .
        </p>
      </section>
    </>
  );
}
