import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productService } from '@/services/product.service';
import Product from './Product';
import { generateMeta, POPULAR_KEYWORDS } from '@/components/meta/Meta';
import { SITE_DESCRIPTION, SITE_NAME } from '@/utils/constants';
import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import { PUBLIC_URL } from '@/config/url.config';
import { cache } from 'react';

export const revalidate = 300;

export async function generateStaticParams() {
  // TODO
  const productsData = await productService.getAll();
  const res = productsData?.products
    ? productsData?.products?.map((product) => ({ id: product.id }))
    : [];
  return res;
}

export const getProducts = cache(async (id: string) => {
  const [product, similarProducts] = await Promise.all([
    productService.getById(id),
    productService.getSimilar(id, { limit: 4, skip: 0 }),
  ]);

  if (!product) notFound();

  return { product, similarProducts };
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { product } = await getProducts(id);

  const brand = product?.brand?.name || '';
  const category = product?.category?.name || '';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${process.env.NEXT_PUBLIC_CLIENT_URL}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: `${process.env.NEXT_PUBLIC_CLIENT_URL}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `${process.env.NEXT_PUBLIC_CLIENT_URL}/product/${id}`,
      },
    ],
  };

  const meta = generateMeta({
    title: `${SITE_NAME} | ${product.title}`,
    description:
      product.description?.slice(0, 160) ??
      `Buy ${product.title} by ${brand} at ${SITE_NAME}`,
    image: product.images[0],
    isPublic: true,
    keywords: [
      ...POPULAR_KEYWORDS,
      product.title,
      brand,
      category,
      `${brand} ${product.title}`,
      `${category} ${product.title}`,
    ],
    author: SITE_NAME,
    ogType: 'website',
    url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/product/${id}`,
    other: {
      'application/ld+json': JSON.stringify(breadcrumbJsonLd),
    },
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
