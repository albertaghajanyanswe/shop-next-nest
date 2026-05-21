import { IMainStatistics } from '@/shared/types/statistics.interface';
import { getIcon } from './statistics.util';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import CountUp from 'react-countup';
import { formatPrice } from '@/utils/formatPrice';

interface IMainStatisticsItemProps {
  item: IMainStatistics;
}

const cardStyles: Record<number, { className: string; accentClass: string }> = {
  1: { className: 'card-green', accentClass: 'bg-[oklch(0.5_0.2_150)]' },
  2: { className: 'card-blue', accentClass: 'bg-[oklch(0.52_0.16_210)]' },
  3: { className: 'card-yellow', accentClass: 'bg-[oklch(0.66_0.2_55)]' },
  4: { className: 'card-lime', accentClass: 'bg-[oklch(0.64_0.2_85)]' },
};

export function MainStatisticsItem({ item }: IMainStatisticsItemProps) {
  const Icon = getIcon(item.id);
  const style = cardStyles[item.id] || cardStyles[1];

  return (
    <Card
      className={`relative overflow-hidden rounded-[12px] border p-4 ${style.className} justify-between gap-1 shadow-xs`}
    >
      <div
        className={`absolute top-0 left-0 z-2 h-full w-1 rounded-r-[4px] ${style.accentClass}`}
      />
      <CardHeader className='relative z-10 flex flex-row items-center justify-between space-y-0 px-0 py-0'>
        <CardTitle className='text-foreground text-sm font-medium'>
          {item.name}
        </CardTitle>
        <Icon className='size-5' />
      </CardHeader>
      <CardContent className='relative z-10 px-0 py-2'>
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
