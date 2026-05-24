import { FC } from 'react';
import { Skeleton } from '../Skeleton';
import Loading from '@/components/customComponents/loading/Loading';

const DataTableLoading: FC = () => {
  return (
    <div className='mx-auto mt-6 w-full max-w-screen-2xl'>
      <Skeleton className='bg-shop-bg h-8 w-48' />
      <Skeleton className='bg-shop-bg mt-6 h-8 w-72' />
      <Loading text='Loading...' />
    </div>
  );
};

export default DataTableLoading;
