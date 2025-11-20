import { Catalog } from '@/components/ui/catalog/Catalog';
import { categoryService } from '@/services/category.service';
import { productService } from '@/services/product.service';
import type { Metadata } from 'next';

export const revalidate = 60;

async function getProducts(categoryId: string) {
  const [products, category] = await Promise.all([
    productService.getByCategoryId(categoryId),
    categoryService.getById(categoryId),
  ]);

  return { products, category };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { category, products } = await getProducts(id);

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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { category, products } = await getProducts(id);

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
