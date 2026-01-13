import { Metadata } from 'next';
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
  const meta = generateMeta({
    title: `${SITE_NAME} | Purchase Success`,
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

  return (
    <div className='global-container'>
      <Breadcrumbs
        items={[{ title: 'Home', href: '/' }, { title: 'Payment success' }]}
        classNames='mt-4'
      />
      <PaymentSuccessPage orderId={orderId} />
    </div>
  );
}
