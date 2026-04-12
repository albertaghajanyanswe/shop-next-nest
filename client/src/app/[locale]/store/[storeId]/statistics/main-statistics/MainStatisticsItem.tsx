import { IMainStatistics } from '@/shared/types/statistics.interface';
import { getIcon } from './statistics.util';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import CountUp from 'react-countup';
import { formatPrice } from '@/utils/formatPrice';

interface IMainStatisticsItemProps {
  item: IMainStatistics;
}

export function MainStatisticsItem({ item }: IMainStatisticsItemProps) {
  const Icon = getIcon(item.id);
  return (
    <Card className='gap-1 py-2 drop-shadow-xs'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 px-4 py-2'>
        <CardTitle className='text-shop-primary-text text-sm font-medium'>
          {item.name}
        </CardTitle>
        <Icon className='size-5' />
      </CardHeader>
      <CardContent className='px-4 py-2'>
        <h2 className='text-2xl font-semibold'>
          {item.id !== 1 ? (
            <CountUp end={item.value} />
          ) : (
            <CountUp end={item.value} formattingFn={formatPrice} />
          )}
        </h2>
      </CardContent>
    </Card>
  );
}
