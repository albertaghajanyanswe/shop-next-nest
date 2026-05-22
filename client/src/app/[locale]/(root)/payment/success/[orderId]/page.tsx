import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMeta, POPULAR_KEYWORDS } from '@/components/meta/Meta';
import { SITE_DESCRIPTION, SITE_NAME } from '@/utils/constants';
import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import PaymentSuccessPage from './PaymentSuccessPage';

// TODO axiosAuthServer example
// async function getOrder(orderId: string) {
//   const token = (await cookies()).get('accessToken')?.value;
//   const api = await AxiosAuthServer();
//   const { data: order } = await api<GetOrderWithItemsDto>({
//     url: API_URL.orders(`/${orderId}`),
//     method: 'GET',
//   });

//   return { order };
// }

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('PaymentSuccess');
  const meta = generateMeta({
    title: `${SITE_NAME} | ${t('title')}`,
    description: SITE_DESCRIPTION,
    isPublic: true,
    keywords: [...POPULAR_KEYWORDS],
    author: SITE_NAME,
    ogType: 'website',
    url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/payment/success`,
  });
  return meta;
}

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const t = await getTranslations('PaymentSuccess');
  const headerT = await getTranslations('HeaderMenu');

  return (
    <div className='global-container'>
      <Breadcrumbs
        items={[
          { title: headerT('Home'), href: '/' },
          { title: t('breadcrumb') },
        ]}
        classNames='mt-4'
      />
      <PaymentSuccessPage orderId={orderId} />
    </div>
  );
}
