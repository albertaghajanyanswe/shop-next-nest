import { HomeBanner } from '../../components/ui/homeBanner/HomeBanner';
import { Catalog } from '@/components/ui/catalog/Catalog';
import ShopByCard from '@/components/ui/shopByCard/ShopByCard';
import { PUBLIC_URL } from '@/config/url.config';
import {
  GetBrandDto,
  GetCategoryDto,
  GetProductWithDetails,
} from '@/generated/orval/types';

interface HomeProps {
  products: GetProductWithDetails[];
  categories: GetCategoryDto[];
  brands: GetBrandDto[];
}

export default function Home({ products, categories, brands }: HomeProps) {
  return (
    <>
      <HomeBanner />
      {categories && categories.length > 0 && (
        <div className='global-container mt-8 flex-1'>
          <ShopByCard<GetCategoryDto>
            title='Shop By Category'
            description='The most popular categories'
            linkTitle='View all'
            linkClb={PUBLIC_URL.shop}
            data={categories}
          />
        </div>
      )}
      <div className='global-container mt-8 flex-1'>
        <Catalog
          title='Most Popular'
          description='The most popular products on the market'
          descriptionLabel='Category description:'
          linkTitle='View all'
          link={PUBLIC_URL.shop()}
          products={products}
        />
      </div>
      {brands && brands.length > 0 && (
        <div className='global-container mt-8 flex-1 py-6'>
          <ShopByCard<GetBrandDto>
            title='Shop By Brand'
            description='The most popular brands'
            linkTitle='View all'
            linkClb={PUBLIC_URL.shop}
            data={brands}
          />
        </div>
      )}
    </>
  );
}
