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
        <p className='text-lg font-semibold text-neutral-700'>{title}</p>
        <p className='text-xl font-bold text-shop-red'>{value}</p>
      </div>
    </div>
  );
};

export const TotalSection = memo(TotalSectionComponent);
