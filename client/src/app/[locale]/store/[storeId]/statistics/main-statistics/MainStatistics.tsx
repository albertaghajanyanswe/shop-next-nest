import { useGetStatistics } from '@/hooks/queries/statistics/useGetStatistics';
import { MainStatisticsItem } from './MainStatisticsItem';
import NoDataFound from '@/components/customComponents/loading/NoDataFound';
import { useTranslations } from 'next-intl';

export function MainStatistics() {
  const t = useTranslations('StorePages');
  const { mainStatistics, isLoadingMainStatistics } = useGetStatistics();

  if (isLoadingMainStatistics) {
    return <div>{t('loading')}</div>;
  }

  const hasData = !!mainStatistics?.length;
  return hasData ? (
    <div className='mt-3 grid grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4'>
      {mainStatistics.map((item) => (
        <MainStatisticsItem key={item.id} item={item} />
      ))}
    </div>
  ) : (
    <div className='mt-4'>
      <NoDataFound entityName={t('main_statistics')} />
    </div>
  );
}
