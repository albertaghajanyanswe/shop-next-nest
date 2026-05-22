import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import PageHeader from '@/components/customComponents/PageHeader';
import { SITE_NAME } from '@/utils/constants';
import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations('PrivacyPage');
  const headerT = useTranslations('HeaderMenu');

  return (
    <>
      <Breadcrumbs
        items={[
          { title: headerT('Home'), href: '/' },
          { title: t('breadcrumb_privacy') },
        ]}
      />

      <PageHeader
        title={t('page_title')}
        description={t('page_description')}
        classNames='mt-4'
      />

      <section className='leading-relaxed; text-shop-muted-text-6 space-y-6'>
        <p className='text-sm'>{t('intro', { siteName: SITE_NAME })}</p>

        <h2 className='text-shop-primary-text mt-4 mb-3 text-xl font-semibold'>
          {t('section_1_title')}
        </h2>
        <p className='text-sm'>{t('section_1_intro')}</p>
        <ul className='list-disc pl-6 text-sm'>
          <li>{t('section_1_item_1')}</li>
          <li>{t('section_1_item_2')}</li>
          <li>{t('section_1_item_3')}</li>
          <li>{t('section_1_item_4')}</li>
        </ul>

        <h2 className='text-shop-primary-text mt-4 mb-3 text-xl font-semibold'>
          {t('section_2_title')}
        </h2>
        <p className='text-sm'>{t('section_2_intro')}</p>
        <ul className='list-disc pl-6 text-sm'>
          <li>{t('section_2_item_1')}</li>
          <li>{t('section_2_item_2')}</li>
          <li>{t('section_2_item_3')}</li>
          <li>{t('section_2_item_4')}</li>
          <li>{t('section_2_item_5')}</li>
        </ul>

        <h2 className='text-shop-primary-text mt-4 mb-3 text-xl font-semibold'>
          {t('section_3_title')}
        </h2>
        <p className='text-sm'>{t('section_3_text')}</p>

        <h2 className='text-shop-primary-text mt-4 mb-3 text-xl font-semibold'>
          {t('section_4_title')}
        </h2>
        <p className='text-sm'>{t('section_4_intro')}</p>
        <ul className='list-disc pl-6 text-sm'>
          <li>{t('section_4_item_1')}</li>
          <li>{t('section_4_item_2')}</li>
          <li>{t('section_4_item_3')}</li>
          <li>{t('section_4_item_4')}</li>
        </ul>

        <h2 className='text-shop-primary-text mt-4 mb-3 text-xl font-semibold'>
          {t('section_5_title')}
        </h2>
        <p className='text-sm'>{t('section_5_text')}</p>

        <h2 className='text-shop-primary-text mt-4 mb-3 text-xl font-semibold'>
          {t('section_6_title')}
        </h2>
        <p className='text-sm'>{t('section_6_intro')}</p>
        <ul className='list-disc pl-6 text-sm'>
          <li>{t('section_6_item_1')}</li>
          <li>{t('section_6_item_2')}</li>
          <li>{t('section_6_item_3')}</li>
          <li>{t('section_6_item_4')}</li>
        </ul>

        <h2 className='text-shop-primary-text mt-4 mb-3 text-xl font-semibold'>
          {t('section_7_title')}
        </h2>
        <p className='text-sm'>{t('section_7_text')}</p>

        <h2 className='text-shop-primary-text mt-4 mb-3 text-xl font-semibold'>
          {t('section_8_title')}
        </h2>
        <p className='text-sm'>{t('section_8_text')}</p>

        <h2 className='text-shop-primary-text mt-4 mb-3 text-xl font-semibold'>
          {t('section_9_title')}
        </h2>
        <p className='text-sm'>
          {t('section_9_prefix')}
          <a
            href='mailto:albert.aghajanyan.mw@gmail.com'
            className='text-blue-600 underline underline-offset-4 hover:text-blue-800'
          >
            albert.aghajanyan.mw@gmail.com
          </a>
          {t('section_9_suffix')}
        </p>
      </section>
    </>
  );
}
