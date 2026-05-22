import { useGetStatistics } from '@/hooks/queries/statistics/useGetStatistics';
import { LastUsers } from './LastUsers';
import NoDataFound from '@/components/customComponents/loading/NoDataFound';
import { useTranslations } from 'next-intl';

export function MiddleStatistics() {
  const { middleStatistics, isLoadingMiddleStatistics } = useGetStatistics();
  const tT = useTranslations('Common');
  const t = useTranslations('MiddleStatistics');

  if (isLoadingMiddleStatistics) {
    return <div>{tT('loading')}</div>;
  }

  const hasMonthlySales = !!middleStatistics?.monthlySales?.length;
  const hasLastUsers = !!middleStatistics?.lastUsers?.length;
  const hasData = hasMonthlySales || hasLastUsers;
  return hasData ? (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-8'>
      <>
        <div className='col-span-2 lg:col-span-8'>
          <LastUsers data={middleStatistics?.lastUsers || []} />
        </div>
      </>
    </div>
  ) : (
    <div>
      <NoDataFound entityName={t('middle_statistics')} />
    </div>
  );
}
