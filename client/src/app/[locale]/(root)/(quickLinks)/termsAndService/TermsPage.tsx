import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import PageHeader from '@/components/customComponents/PageHeader';
import { SITE_NAME } from '@/utils/constants';
import { useLocale } from 'next-intl';
import TermsPageRu from './TermsPageRu';

export default function TermsPage() {
  const locale = useLocale();
  if (locale === 'ru') return <TermsPageRu />;

  return (
    <>
      <Breadcrumbs
        items={[{ title: 'Home', href: '/' }, { title: 'Terms & Conditions' }]}
      />

      <PageHeader
        title='Terms & Service'
        description='Please read these terms carefully before using our services.'
        classNames='mt-4'
      />

      <p className='mb-4 text-sm text-neutral-500'>
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className='space-y-6 text-sm leading-relaxed'>
        <section className='space-y-2'>
          <h2 className='text-lg font-semibold text-shop-primary-text'>
            1. Acceptance of Terms
          </h2>
          <p className='text-shop-muted-text-7'>
            By accessing or using <b>{SITE_NAME}</b>, you agree to be bound by
            these Terms of Service. If you do not agree with any part of these
            terms, you must stop using the platform.
          </p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-lg font-semibold text-shop-primary-text'>
            2. User Responsibility
          </h2>
          <p className='text-shop-muted-text-7'>
            You are solely responsible for all information, content, and
            materials that you submit or publish on <b>{SITE_NAME}</b> and for
            any consequences that may result from it.
          </p>
          <p className='text-shop-muted-text-7'>
            You confirm that all information provided is accurate, lawful, and
            that you have all necessary rights, licenses, and permissions to
            publish such content.
          </p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-lg font-semibold text-shop-primary-text'>
            3. Intellectual Property
          </h2>
          <p className='text-shop-muted-text-7'>
            All content available on <b>{SITE_NAME}</b>, unless otherwise
            stated, is protected by copyright and belongs to <b>{SITE_NAME}</b>{' '}
            or the respective rights holders.
          </p>
          <p className='text-shop-muted-text-7'>
            You may not copy, reproduce, distribute, or use any content from the
            platform without prior written consent.
          </p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-lg font-semibold text-shop-primary-text'>
            4. Listings & Transactions
          </h2>
          <p className='text-shop-muted-text-7'>
            <b>{SITE_NAME}</b> is an online platform that enables users to post
            listings for buying and selling legally permitted goods and
            services.
          </p>
          <p className='text-shop-muted-text-7'>
            <b>{SITE_NAME}</b> is not a party to any transaction between users
            and does not guarantee the quality, legality, safety, or accuracy of
            listings.
          </p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-lg font-semibold text-shop-primary-text'>
            5. Prohibited Activities
          </h2>
          <ul className='list-disc space-y-1 pl-5 text-shop-muted-text-7'>
            <li>Posting false, misleading, or unlawful content</li>
            <li>Using automated tools to access the platform</li>
            <li>Interfering with the normal operation of the service</li>
            <li>Posting illegal goods, services, or materials</li>
            <li>Violating the rights of other users or third parties</li>
          </ul>
        </section>

        <section className='space-y-2'>
          <h2 className='text-lg font-semibold text-shop-primary-text'>
            6. Limitation of Liability
          </h2>
          <p className='text-shop-muted-text-7'>
            <b>{SITE_NAME}</b> shall not be liable for any damages, losses, or
            disputes arising from transactions between users.
          </p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-lg font-semibold text-shop-primary-text'>
            7. Account Termination
          </h2>
          <p className='text-shop-muted-text-7'>
            <b>{SITE_NAME}</b> reserves the right to suspend or terminate user
            accounts, remove listings, or restrict access at its sole discretion
            if these Terms are violated.
          </p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-lg font-semibold text-shop-primary-text'>
            8. Changes to Terms
          </h2>
          <p className='text-shop-muted-text-7'>
            <b>{SITE_NAME}</b> may update these Terms of Service at any time
            without prior notice. Continued use of the platform constitutes
            acceptance of the updated terms.
          </p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-lg font-semibold text-shop-primary-text'>
            9. Termination by User
          </h2>
          <p className='text-shop-muted-text-7'>
            You may terminate your account at any time without prior notice.
            Upon termination, you must stop using the platform.
          </p>
        </section>
      </div>
    </>
  );
}
