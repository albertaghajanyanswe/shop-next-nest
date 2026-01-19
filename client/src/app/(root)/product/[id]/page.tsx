import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productService } from '@/services/product.service';
import Product from './Product';
import { generateMeta, POPULAR_KEYWORDS } from '@/components/meta/Meta';
import { SITE_DESCRIPTION, SITE_NAME } from '@/utils/constants';
import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import { PUBLIC_URL } from '@/config/url.config';

export const revalidate = 60;

// export async function generateStaticParams() {
//   // TODO
//   const productsData = await productService.getAll();
//   const res = productsData?.products
//     ? productsData?.products?.map((product) => ({ id: product.id }))
//     : [];
//   return res;
// }

async function getProducts(id: string) {
  try {
    const [product, similarProducts] = await Promise.all([
      productService.getById(id),
      productService.getSimilar(id, { limit: 4, skip: 0 }),
    ]);
    return { product, similarProducts };
  } catch (err) {
    console.log('ERROR ', err);
    return notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { product } = await getProducts(id);

  const brand = product?.brand?.name || '';
  const category = product?.category?.name || '';

  const meta = generateMeta({
    title: `${SITE_NAME} | ${product.title}`,
    description: product.description || SITE_DESCRIPTION,
    image: product.images[0],
    isPublic: true,
    keywords: [...POPULAR_KEYWORDS, brand, category],
    author: SITE_NAME,
    ogType: 'website',
    url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/shop`,
  });
  return meta;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { product, similarProducts } = await getProducts(id);

  return (
    <div className='global-container'>
      <Breadcrumbs
        items={[
          { title: 'Home', href: '/' },
          { title: 'Shop', href: PUBLIC_URL.shop() },
          { title: product.title },
        ]}
        classNames='mt-4'
      />
      <Product
        initialProduct={product}
        similarProducts={similarProducts}
        id={id}
      />
    </div>
  );
}
