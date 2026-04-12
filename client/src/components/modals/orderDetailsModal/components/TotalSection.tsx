import { Button } from '@/components/ui/Button';
import { GetUserDto } from '@/generated/orval/types';
import { useDistributeFundsOrder } from '@/hooks/stripe/useDistributeFundsOrder';
import { memo } from 'react';

interface TotalSectionProps {
  title: string;
  value: number | string;
}
const TotalSectionComponent = ({ title, value }: TotalSectionProps) => {
  return (
    <div className='flex justify-end'>
      <div className='text-right'>
        <p className='text-lg font-semibold text-shop-muted-text-7'>{title}</p>
        <p className='text-shop-red text-xl font-bold'>{value}</p>
      </div>
    </div>
  );
};

export const TotalSection = memo(TotalSectionComponent);
