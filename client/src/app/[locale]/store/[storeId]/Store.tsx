'use client';
import { Heading } from '@/components/ui/Heading';
import { MainStatistics } from './statistics/mainStatistics/MainStatistics';
import { MiddleStatistics } from './statistics/middleStatistics/MiddleStatistics';
import { TopProducts } from './statistics/topProducts/TopProducts';
import { CategorySales } from './statistics/categorySales/CategorySales';
import { ProfitOverview } from './statistics/profitOverview/ProfitOverview';
import { useGetStatistics } from '@/hooks/queries/statistics/useGetStatistics';
import NoDataFound from '@/components/customComponents/loading/NoDataFound';
import { useTranslations } from 'next-intl';
import Loading from '@/components/customComponents/loading/Loading';

export default function Store() {
  const t = useTranslations('StorePages');
  const {
    topProducts,
    categorySales,
    salesHistory,
    selectedRange,
    setSelectedRange,
    isLoadingTopProducts,
    isLoadingCategorySales,
    isLoadingSalesHistory,
  } = useGetStatistics();

  return (
    <div className='p-6'>
      <Heading title={t('title')} />

      <MainStatistics />

      <div className='mt-6'>
        <ProfitOverview
          initialData={salesHistory || []}
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
          isLoading={isLoadingSalesHistory}
        />
      </div>

      <div className='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <div>
          {isLoadingCategorySales ? (
            <Loading />
          ) : categorySales?.length ? (
            <CategorySales data={categorySales} />
          ) : (
            <NoDataFound entityName={t('categories')} />
          )}
        </div>
        <MiddleStatistics />
      </div>

      <div className='mt-6'>
        {isLoadingTopProducts ? (
          <div>{t('loading')}</div>
        ) : topProducts?.length ? (
          <TopProducts data={topProducts} />
        ) : (
          <NoDataFound entityName={t('products')} />
        )}
      </div>
    </div>
  );
}
