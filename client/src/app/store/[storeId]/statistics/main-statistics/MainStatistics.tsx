import { useGetStatistics } from '@/hooks/queries/statistics/useGetStatistics';
import { MainStatisticsItem } from './MainStatisticsItem';

export function MainStatistics() {
  const { mainStatistics, isLoadingMainStatistics } = useGetStatistics();

  if (isLoadingMainStatistics) {
    return <div>Loading...</div>;
  }

  return (
    <div className='mt-3 grid grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4'>
      {mainStatistics?.length ? (
        mainStatistics.map((item) => (
          <MainStatisticsItem key={item.id} item={item} />
        ))
      ) : (
        <div>No data for statistics</div>
      )}
    </div>
  );
}
