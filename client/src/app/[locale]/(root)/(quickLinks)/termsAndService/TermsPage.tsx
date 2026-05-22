'use client';

import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import PageHeader from '@/components/customComponents/PageHeader';
import { SITE_NAME } from '@/utils/constants';
import { useTranslations } from 'next-intl';

export default function TermsPage() {
  const t = useTranslations('TermsPage');
  const headerT = useTranslations('HeaderMenu');

  return (
    <>
      <Breadcrumbs
        items={[
          { title: headerT('Home'), href: '/' },
          { title: t('breadcrumb_terms') },
        ]}
      />

      <PageHeader
        title={t('page_title')}
        description={t('page_description')}
        classNames='mt-4'
      />

      <div className='space-y-6 text-sm leading-relaxed'>
        <section className='space-y-2'>
          <h2 className='text-shop-primary-text text-lg font-semibold'>
            {t('section_1_title')}
          </h2>
          <p className='text-shop-muted-text-7'>
            {t.rich('section_1_text', {
              siteName: (chunks) => <b>{chunks}</b>,
              siteNameValue: SITE_NAME,
            })}
          </p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-shop-primary-text text-lg font-semibold'>
            {t('section_2_title')}
          </h2>
          <p className='text-shop-muted-text-7'>
            {t.rich('section_2_text_1', {
              siteName: (chunks) => <b>{chunks}</b>,
              siteNameValue: SITE_NAME,
            })}
          </p>
          <p className='text-shop-muted-text-7'>{t('section_2_text_2')}</p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-shop-primary-text text-lg font-semibold'>
            {t('section_3_title')}
          </h2>
          <p className='text-shop-muted-text-7'>
            {t.rich('section_3_text_1', {
              siteName: (chunks) => <b>{chunks}</b>,
              siteNameValue: SITE_NAME,
            })}
          </p>
          <p className='text-shop-muted-text-7'>{t('section_3_text_2')}</p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-shop-primary-text text-lg font-semibold'>
            {t('section_4_title')}
          </h2>
          <p className='text-shop-muted-text-7'>
            {t.rich('section_4_text_1', {
              siteName: (chunks) => <b>{chunks}</b>,
              siteNameValue: SITE_NAME,
            })}
          </p>
          <p className='text-shop-muted-text-7'>
            {t.rich('section_4_text_2', {
              siteName: (chunks) => <b>{chunks}</b>,
              siteNameValue: SITE_NAME,
            })}
          </p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-shop-primary-text text-lg font-semibold'>
            {t('section_5_title')}
          </h2>
          <ul className='text-shop-muted-text-7 list-disc space-y-1 pl-5'>
            <li>{t('section_5_item_1')}</li>
            <li>{t('section_5_item_2')}</li>
            <li>{t('section_5_item_3')}</li>
            <li>{t('section_5_item_4')}</li>
            <li>{t('section_5_item_5')}</li>
          </ul>
        </section>

        <section className='space-y-2'>
          <h2 className='text-shop-primary-text text-lg font-semibold'>
            {t('section_6_title')}
          </h2>
          <p className='text-shop-muted-text-7'>
            {t.rich('section_6_text', {
              siteName: (chunks) => <b>{chunks}</b>,
              siteNameValue: SITE_NAME,
            })}
          </p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-shop-primary-text text-lg font-semibold'>
            {t('section_7_title')}
          </h2>
          <p className='text-shop-muted-text-7'>
            {t.rich('section_7_text', {
              siteName: (chunks) => <b>{chunks}</b>,
              siteNameValue: SITE_NAME,
            })}
          </p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-shop-primary-text text-lg font-semibold'>
            {t('section_8_title')}
          </h2>
          <p className='text-shop-muted-text-7'>
            {t.rich('section_8_text', {
              siteName: (chunks) => <b>{chunks}</b>,
              siteNameValue: SITE_NAME,
            })}
          </p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-shop-primary-text text-lg font-semibold'>
            {t('section_9_title')}
          </h2>
          <p className='text-shop-muted-text-7'>{t('section_9_text')}</p>
        </section>
      </div>
    </>
  );
}
