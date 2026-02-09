import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/Chart';
import { IMonthlySales } from '@/shared/types/statistics.interface';
import { formatPrice } from '@/utils/formatPrice';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

interface IOverviewProps {
  data: IMonthlySales[];
}

const chartConfig = {
  value: {
    label: 'Profit (USD)',
    color: '#063d29',
  },
} satisfies ChartConfig;

export function Overview({ data }: IOverviewProps) {
  console.log('DATA = ', data);
  return (
    <Card className='py-4'>
      <CardHeader className='flex flex-col items-stretch justify-between space-y-0 border-b px-4 [.border-b]:pb-4'>
        <CardTitle className='text-xl font-medium tracking-[0.1px]'>
          Last month profit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className='aspect-auto h-[310px] w-full'
          config={chartConfig}
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 4, right: 4 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={0}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  // labelFormatter={formatPrice}
                  indicator='line'
                />
              }
            />
            <Area
              dataKey='value'
              type='natural'
              stroke='var(--color-value)'
              fill='var(--color-value)'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
