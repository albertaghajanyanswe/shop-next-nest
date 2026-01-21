import { Metadata } from 'next';
import { storeService } from '@/services/store.service';
import {
  COlLAGE_IMG,
  generateMeta,
  POPULAR_KEYWORDS,
} from '@/components/meta/Meta';
import { SITE_NAME } from '@/utils/constants';
import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import { PUBLIC_URL } from '@/config/url.config';
import StoresPage from './StoresPage';

export async function generateMetadata(): Promise<Metadata> {
  const storesData = await storeService.getAll({ limit: 5, skip: 0 });

  const topStores = Array.from(
    new Set(
      storesData?.stores
        ?.map((p) => p?.title)
        .filter((x): x is string => Boolean(x))
    )
  );
  const storesList = topStores.join(', ');

  const description = `Explore all products at ${SITE_NAME} — from ${storesList} top stores.`;

  const meta = generateMeta({
    title: `${SITE_NAME} | Stores`,
    description,
    image: COlLAGE_IMG,
    isPublic: true,
    keywords: [...POPULAR_KEYWORDS],
    author: SITE_NAME,
    ogType: 'website',
    url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${PUBLIC_URL.stores()}`,
  });

  return meta;
}

export const revalidate = 60;

async function getStores() {
  // TODO
  const stores = await storeService.getAll();
  return stores;
}

export default async function Stores() {
  const storesData = await getStores();

  return (
    <div className='global-container my-6'>
      <Breadcrumbs
        items={[{ title: 'Home', href: '/' }, { title: 'Stores' }]}
        classNames='mt-4'
      />

      <StoresPage
        stores={storesData?.stores}
        totalCount={storesData?.totalCount}
      />
    </div>
  );
}
