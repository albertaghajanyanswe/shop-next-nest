import { FC } from 'react';
import { Card, CardContent } from '../Card';
import { Loader } from '../Loader';
import { Skeleton } from '../Skeleton';

const DataTableLoading: FC = () => {
  return (
    <div className='mx-auto w-full max-w-screen-2xl'>
      <Skeleton className='h-8 w-48' />
      <Skeleton className='mt-6 h-8 w-72' />
      <Card className='mt-6'>
        <CardContent>
          <div className='flex h-[520px] w-full items-center justify-center'>
            <Loader />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataTableLoading;
