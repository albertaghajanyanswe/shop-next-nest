import { FC } from 'react';
import { Skeleton } from '../Skeleton';
import Loading from '@/components/customComponents/loading/Loading';

const DataTableLoading: FC = () => {
  return (
    <div className='mx-auto w-full max-w-screen-2xl mt-6'>
      <Skeleton className='h-8 w-48   bg-shop-bg' />
      <Skeleton className='mt-6 h-8 w-72 bg-shop-bg' />
      <Loading text='Loading...' />
    </div>
  );
};

export default DataTableLoading;
