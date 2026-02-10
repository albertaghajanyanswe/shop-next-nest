import { useGetStatistics } from '@/hooks/queries/statistics/useGetStatistics';
import { MainStatisticsItem } from './MainStatisticsItem';
import NoDataFound from '@/components/customComponents/loading/NoDataFound';

export function MainStatistics() {
  const { mainStatistics, isLoadingMainStatistics } = useGetStatistics();

  if (isLoadingMainStatistics) {
    return <div>Loading...</div>;
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
      <NoDataFound entityName='main statistics' />
    </div>
  );
}
