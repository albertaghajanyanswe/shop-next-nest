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
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/Chart';
import {
  ChartDataItem,
  ICategorySales,
} from '@/shared/types/statistics.interface';
import { PieChart, Pie, Tooltip } from 'recharts';
import { useTranslations } from 'next-intl';
import { generateColorFromName } from '@/utils/colorUtils';
import { useMemo } from 'react';
import { toTitleCase } from '@/utils/common';

interface ICategorySalesProps {
  data: ICategorySales[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className='bg-background/80 rounded-lg p-2 shadow-lg'>
        <p className='text-sm font-semibold'>{data.title}</p>
        <p className='text-muted-foreground text-xs font-semibold'>
          {data.percentage.toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

export function CategorySales({ data }: ICategorySalesProps) {
  const t = useTranslations('MiddleStatistics');

  const chartData = useMemo(() => {
    const result = data.map((cat) => ({
      title: cat.name,
      value: Math.round(cat.percentage),
      percentage: cat.percentage,
      revenue: cat.revenue,
      fill: generateColorFromName(cat.name),
    }));
    return result;
  }, [data]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    for (const item of chartData) {
      const key = item['title' as keyof ChartDataItem];

      if (typeof key !== 'string') {
        continue;
      }

      config[key] = {
        label: toTitleCase(key),
        color: item.fill,
      };
    }
    return config;
  }, data) satisfies ChartConfig;

  return (
    <Card className='py-4'>
      <CardHeader className='flex flex-col items-stretch justify-between space-y-0 border-b px-4 [.border-b]:pb-4'>
        <CardTitle className='text-xl font-medium tracking-[0.1px]'>
          {t('sales_by_category')}
        </CardTitle>
        <CardDescription className='text-muted-foreground text-xs'>
          {t('share_of_total_revenue')}
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'
        >
          <PieChart>
            <Pie data={chartData} dataKey='value' />
            <ChartLegend
              content={<ChartLegendContent nameKey='title' />}
              className='-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center'
            />
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
