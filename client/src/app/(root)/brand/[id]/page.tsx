import { Catalog } from '@/components/ui/catalog/Catalog';
import { brandService } from '@/services/brandService';
import { categoryService } from '@/services/category.service';
import { productService } from '@/services/product.service';
import type { Metadata } from 'next';

export const revalidate = 60;

async function getProducts(brandId: string) {
  const [products, brand] = await Promise.all([
    productService.getByBrandId(brandId),
    brandService.getById(brandId),
  ]);

  return { products, brand };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { brand, products } = await getProducts(id);

  return {
    title: brand.name,
    description: brand.description,
    openGraph: {
      title: brand.name,
      description: brand.description,
      images: [
        {
          url: products?.[0]?.images?.[0] || '',
          width: 800,
          height: 600,
          alt: brand.name,
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
  const { brand, products } = await getProducts(id);

  return (
    <div className='global-container my-6'>
      <Catalog
        title={brand.name}
        description={brand.description}
        descriptionLabel='Brand description:'
        products={products}
      />
    </div>
  );
}
