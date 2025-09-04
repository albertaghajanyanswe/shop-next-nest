import { useGetStatistics } from '@/hooks/queries/statistics/useGetStatistics';
import { Overview } from './Overview';
import { LastUsers } from './LastUsers';

export function MiddleStatistics() {
  const { middleStatistics, isLoadingMiddleStatistics } = useGetStatistics();

  if (isLoadingMiddleStatistics) {
    return <div>Loading...</div>;
  }

  return (
    <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
      {middleStatistics?.monthlySales?.length ||
      middleStatistics?.lastUsers?.length ? (
        <>
          <div className='col-span-1 lg:col-span-3 xl:col-span-4'>
            <Overview data={middleStatistics.monthlySales} />
          </div>
          <div className='col-span-1 lg:col-span-3'>
            <LastUsers data={middleStatistics.lastUsers} />
          </div>
        </>
      ) : (
        <div> No data for middle statistics </div>
      )}
    </div>
  );
}
