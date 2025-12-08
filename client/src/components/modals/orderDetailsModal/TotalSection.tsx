import { memo } from 'react';

interface TotalSectionProps {
  title: string;
  value: number | string;
}
const TotalSectionComponent = ({ title, value }: TotalSectionProps) => {
  return (
    <div className='flex justify-end border-t pt-4'>
      <div className='text-right'>
        <p className='text-sm font-semibold text-neutral-700'>{title}</p>
        <p className='text-xl font-bold'>{value}</p>
      </div>
    </div>
  );
};

export const TotalSection = memo(TotalSectionComponent);
