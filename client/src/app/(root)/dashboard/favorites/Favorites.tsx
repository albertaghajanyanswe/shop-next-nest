'use client';

import { Catalog } from '@/components/ui/catalog/Catalog';
import { useProfile } from '@/hooks/useProfile';

export default function Favorites() {
  const { user } = useProfile();
  if (!user) return null;

  return (
    <div className='my-6'>
      <Catalog title='Favorites products' products={user.favorites} />
    </div>
  );
}
