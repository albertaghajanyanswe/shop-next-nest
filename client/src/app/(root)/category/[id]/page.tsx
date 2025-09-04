import { Catalog } from '@/components/ui/catalog/Catalog';
import { categoryService } from '@/services/category.service';
import { productService } from '@/services/product.service';
import { Metadata } from 'next';

export const revalidate = 60;

async function getProducts(params: { id: string }) {
  const products = await productService.getByCategoryId(params.id);
  const category = await categoryService.getById(params.id);

  return { products, category };
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { category, products } = await getProducts(params);

  return {
    title: category.title,
    description: category.description,
    openGraph: {
      title: category.title,
      description: category.description,
      images: [
        {
          url: products?.[0]?.images?.[0] || '',
          width: 800,
          height: 600,
          alt: category.title,
        },
      ],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const { category, products } = await getProducts(params);

  return (
    <div className='my-6'>
      <Catalog
        title={category.title}
        description={category.description}
        products={products}
      />
    </div>
  );
}
