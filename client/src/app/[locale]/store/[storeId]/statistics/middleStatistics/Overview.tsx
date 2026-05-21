'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/Chart';
import { IMonthlySales } from '@/shared/types/statistics.interface';
import { formatPrice } from '@/utils/formatPrice';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import { useTranslations } from 'next-intl';

interface IOverviewProps {
  data: IMonthlySales[];
}

export function Overview({ data }: IOverviewProps) {
  const t = useTranslations('MiddleStatistics');

  const totalRevenue = data.reduce((sum, item) => sum + item.value, 0);

  const chartConfig = {
    value: {
      label: t('profit_usd'),
      color: 'hsl(var(--color-primary))',
    },
  } satisfies ChartConfig;

  return (
    <Card className='py-4'>
      <CardHeader className='flex flex-col items-stretch justify-between space-y-0 border-b px-4 sm:flex-row sm:items-center [.border-b]:pb-4'>
        <div>
          <CardTitle className='text-xl font-medium tracking-[0.1px]'>
            {t('profit_overview')}
          </CardTitle>
          <p className='text-muted-foreground mt-1 text-xs'>
            {t('revenue_trend')}
          </p>
        </div>
        <div className='mt-4 text-right sm:mt-0'>
          <p className='text-2xl font-semibold'>{formatPrice(totalRevenue)}</p>
          <p className='text-muted-foreground text-xs'>{t('total')}</p>
        </div>
      </CardHeader>
      <CardContent className='pt-6'>
        {data?.length > 0 ? (
          <ChartContainer config={chartConfig} className='h-[260px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={data}
                margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray='3 3' />
                <XAxis
                  dataKey='date'
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatPrice(value)}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => `${value}`}
                      formatter={(value) => formatPrice(value as number)}
                    />
                  }
                />
                <Bar
                  dataKey='value'
                  fill='hsl(var(--color-primary))'
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className='text-muted-foreground flex h-[260px] items-center justify-center'>
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
