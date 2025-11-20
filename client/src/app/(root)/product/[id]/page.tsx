import { productService } from '@/services/product.service';
import { Metadata } from 'next';
import Product from './Product';
import { notFound } from 'next/navigation';
import { EnvVariables } from '@/shared/envVariables';

export const revalidate = 60;

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'production') {
    return [];
  }

  const products = await productService.getAll();
  const res = products ? products.map((product) => ({ id: product.id })) : [];
  console.log('generateStaticParams = RES = ', res)
  return res;
}

async function getProducts(id: string) {
  try {

    console.log('getProducts ID = ', id)
    // const product = await productService.getById(id)
    const [product, similarProducts] = await Promise.all([
      productService.getById(id),
      productService.getSimilar(id),
    ]);

    // console.log('product = ', product)
    return { product, similarProducts };
  } catch(err) {
    console.log('ERROR ', err)
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

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { product, similarProducts } = await getProducts(id);

  return (
    <Product
      initialProduct={product}
      similarProducts={similarProducts}
      id={id}
    />
  );
}
