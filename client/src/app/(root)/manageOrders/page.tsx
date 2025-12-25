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
import { orderService } from '@/services/order.service';
import ManageOrdersPage from './ManageOrdersPage';

export async function generateMetadata(): Promise<Metadata> {
  const description = `Manage users orders at ${SITE_NAME}.`;

  const meta = generateMeta({
    title: `${SITE_NAME} | Shop`,
    description,
    image: COlLAGE_IMG,
    isPublic: true,
    keywords: [...POPULAR_KEYWORDS],
    author: SITE_NAME,
    ogType: 'website',
    url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${PUBLIC_URL.manageOrders()}`,
  });

  console.log('META = ', meta);
  return meta;
}

export const revalidate = 60;


export default async function Orders() {

  return (
    <div className='global-container my-6'>
      <Breadcrumbs
        items={[{ title: 'Home', href: '/' }, { title: 'Stores' }]}
        classNames='mt-4'
      />

      <ManageOrdersPage />
    </div>
  );
}
