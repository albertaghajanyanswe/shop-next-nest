import { useGetStatistics } from '@/hooks/queries/statistics/useGetStatistics';
import { Overview } from './Overview';
import { LastUsers } from './LastUsers';
import NoDataFound from '@/components/customComponents/loading/NoDataFound';

export function MiddleStatistics() {
  const { middleStatistics, isLoadingMiddleStatistics } = useGetStatistics();

  if (isLoadingMiddleStatistics) {
    return <div>Loading...</div>;
  }

  const hasMonthlySales = !!middleStatistics?.monthlySales?.length;
  const hasLastUsers = !!middleStatistics?.lastUsers?.length;
  const hasData = hasMonthlySales || hasLastUsers;
  return hasData ? (
    <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-8'>
      <>
        <div className='col-span-1 lg:col-span-4 xl:col-span-4'>
          <Overview data={middleStatistics?.monthlySales || []} />
        </div>
        <div className='col-span-1 lg:col-span-4'>
          <LastUsers data={middleStatistics?.lastUsers || []} />
        </div>
      </>
    </div>
  ) : (
    <div className='mt-4'>
      <NoDataFound entityName='middle statistics' />
    </div>
  );
}
