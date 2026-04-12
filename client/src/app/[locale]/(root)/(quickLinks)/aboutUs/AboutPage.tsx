import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import PageHeader from '@/components/customComponents/PageHeader';
import { SITE_NAME } from '@/utils/constants';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('QuickLinks.About');
  const tCommon = useTranslations('HeaderMenu');
  return (
    <>
      <Breadcrumbs
        items={[{ title: tCommon('Home'), href: '/' }, { title: t('title') }]}
      />

      <PageHeader
        title={t('title')}
        description={t('description')}
        classNames='mt-4'
      />

      <section>
        <div className='flex flex-col gap-y-4'>
          <p className='leading-relaxed; text-sm text-shop-muted-text-6'>
            {t('p1', { siteName: SITE_NAME })}
          </p>
          <p className='leading-relaxed; text-sm text-shop-muted-text-6'>
            {t('p2')}
          </p>
          <p className='leading-relaxed; text-sm text-shop-muted-text-6'>
            {t('p3', { siteName: SITE_NAME })}
          </p>
        </div>
      </section>
    </>
  );
}
