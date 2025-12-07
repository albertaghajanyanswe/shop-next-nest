'use client';

import NoDataFound from '@/components/customComponents/loading/NoDataFound';
import { Catalog } from '@/components/ui/catalog/Catalog';
import { useProfile } from '@/hooks/useProfile';

export default function Favorites() {
  const { user } = useProfile();
  if (!user) return <NoDataFound entityName='Favorites products' />;

  return (
    <div className='global-container my-6'>
      <Catalog title='Favorites products' products={user.favorites} />
    </div>
  );
}
