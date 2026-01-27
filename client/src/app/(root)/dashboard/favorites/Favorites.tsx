'use client';

import NoDataFound from '@/components/customComponents/loading/NoDataFound';
import { Catalog } from '@/components/customComponents/catalog/Catalog';
import { useProfile } from '@/hooks/useProfile';
import Breadcrumbs from '@/components/customComponents/Breadcrumbs';

export default function Favorites() {
  const { user } = useProfile();
  if (!user) return <NoDataFound entityName='Favorites products' />;

  return (
    <div className='global-container my-6'>
      <Breadcrumbs
        items={[{ title: 'Home', href: '/' }, { title: 'Favorites' }]}
      />
      <Catalog title='Favorites products' products={user.favorites} />
    </div>
  );
}
