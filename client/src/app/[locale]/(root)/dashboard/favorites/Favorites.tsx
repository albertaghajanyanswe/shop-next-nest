'use client';

import NoDataFound from '@/components/customComponents/loading/NoDataFound';
import { Catalog } from '@/components/customComponents/catalog/Catalog';
import { useProfile } from '@/hooks/useProfile';
import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import { useTranslations } from 'next-intl';

export default function Favorites() {
  const { user } = useProfile();
  const t = useTranslations('Dashboard');
  const tHome = useTranslations('HeaderMenu');

  if (!user) return <NoDataFound entityName={t('Favorites_products')} />;

  return (
    <div className='global-container my-6'>
      <Breadcrumbs
        items={[{ title: tHome('Home'), href: '/' }, { title: t('Favorites') }]}
      />
      <div className='mt-4'>
        <Catalog title={t('Favorites_products')} products={user.favorites} />
      </div>
    </div>
  );
}
