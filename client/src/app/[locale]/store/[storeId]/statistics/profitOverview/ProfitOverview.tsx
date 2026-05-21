'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/Chart';
import { ISalesHistory } from '@/shared/types/statistics.interface';
import { formatPrice } from '@/utils/formatPrice';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

interface IProfitOverviewProps {
  initialData: ISalesHistory[];
  selectedRange: '1w' | '1m' | '6m' | '1y' | 'all';
  onRangeChange: (range: '1w' | '1m' | '6m' | '1y' | 'all') => void;
  isLoading?: boolean;
}

type TimeRange = '1w' | '1m' | '6m' | '1y' | 'all';

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '1w', label: '1 Week' },
  { value: '1m', label: '1 Month' },
  { value: '6m', label: '6 Months' },
  { value: '1y', label: '1 Year' },
  { value: 'all', label: 'All Time' },
];

export function ProfitOverview({
  initialData,
  selectedRange,
  onRangeChange,
  isLoading = false,
}: IProfitOverviewProps) {
  const t = useTranslations('MiddleStatistics');

  const totalRevenue = initialData.reduce((sum, item) => sum + item.profit, 0);

  const chartConfig = {
    value: {
      label: 'profitLabel',
      color: 'hsl(var(--color-primary)',
    },
  } satisfies ChartConfig;
  console.log('\n\n\n chartData = ', initialData);
  console.log('chartConfig = ', chartConfig);

  return (
    <Card className='py-4'>
      <CardHeader className='flex flex-col items-stretch justify-between space-y-0 border-b px-4 sm:flex-row sm:items-center [.border-b]:pb-4'>
        <CardTitle>{t('profit_overview')}</CardTitle>
        <div className='mt-4 flex items-center gap-8 sm:mt-0'>
          <div className='text-right'>
            <p className='text-shop-red text-xl font-semibold'>
              {formatPrice(totalRevenue)}
            </p>
            <p className='text-xs font-semibold text-neutral-900'>
              {t('total')}
            </p>
          </div>
          <Select
            disabled={isLoading}
            onValueChange={(e) => onRangeChange(e as TimeRange)}
            defaultValue={selectedRange}
          >
            <SelectTrigger className='w-full min-w-30'>
              <SelectValue placeholder='Select period' />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className='pt-6'>
        {isLoading ? (
          <div className='text-muted-foreground flex h-[300px] items-center justify-center'>
            Loading...
          </div>
        ) : initialData?.length > 0 ? (
          <ChartContainer config={chartConfig} className='h-[250px] w-full'>
            <AreaChart
              accessibilityLayer
              data={initialData}
              margin={{
                left: -20,
                right: -20,
                top: 20,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(profit) => profit.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={3}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator='line' />}
              />
              {/* <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator='line'
                    formatter={(value, name) => {
                      return (
                        <div className='flex w-full items-center justify-between gap-8'>
                          <span className='capitalize'>{name}</span>

                          <span className='font-medium'>{value} $</span>
                        </div>
                      );
                    }}
                  />
                }
              /> */}

              <defs>
                <linearGradient id='fillProfit' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--color-secondary-700)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--color-secondary-700)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <Area
                dataKey='profit'
                type='natural'
                fill='url(#fillProfit)'
                fillOpacity={0.4}
                stroke='var(--color-secondary-700)'
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className='text-muted-foreground flex h-[300px] items-center justify-center'>
            No data available for this period
          </div>
        )}
      </CardContent>
    </Card>
  );
}
