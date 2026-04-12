import { HomeBanner } from '@/components/customComponents/homeBanner/HomeBanner';
import { Catalog } from '@/components/customComponents/catalog/Catalog';
import ShopByCard from '@/components/customComponents/shopByCard/ShopByCard';
import { PUBLIC_URL } from '@/config/url.config';
import {
  GetBrandDto,
  GetCategoryDto,
  GetProductWithDetails,
} from '@/generated/orval/types';
import { useTranslations } from 'next-intl';

interface HomeProps {
  products: GetProductWithDetails[];
  categories: GetCategoryDto[];
  brands: GetBrandDto[];
}

export default function Home({ products, categories, brands }: HomeProps) {
  const t = useTranslations('HomePage');

  return (
    <>
      <HomeBanner />
      {categories && categories.length > 0 && (
        <div className='global-container mt-8 flex-1'>
          <ShopByCard
            title={t('categories_title')}
            description={t('categories_description')}
            linkTitle={t('view_all')}
            linkClb={PUBLIC_URL.shop}
            data={categories}
            filterKey='categoryId'
          />
        </div>
      )}
      <div className='global-container mt-8 flex-1'>
        <Catalog
          title={t('most_popular_title')}
          description={t('most_popular_description')}
          descriptionLabel={t('category_description_label')}
          linkTitle={t('view_all')}
          link={PUBLIC_URL.shop()}
          products={products}
        />
      </div>
      {brands && brands.length > 0 && (
        <div className='global-container mt-8 flex-1 py-6'>
          <ShopByCard
            title={t('brands_title')}
            description={t('brands_description')}
            linkTitle={t('view_all')}
            linkClb={PUBLIC_URL.shop}
            data={brands}
            filterKey='brandId'
          />
        </div>
      )}
    </>
  );
}
