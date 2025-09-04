'use client';

import { DataTable } from '@/components/ui/data-loading/DataTable';
import DataTableLoading from '@/components/ui/data-loading/DataTableLoading';
import { Heading } from '@/components/ui/Heading';
import { useParams } from 'next/navigation';
import { formateDate } from '@/utils/date/formateDate';
import { useGetReviews } from '@/hooks/queries/reviews/useGetReviews';
import { IReviewColumn, reviewColumns } from './ReviewColumns';

export function Reviews() {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { reviews, isLoadingReviews } = useGetReviews();

  const formattedReviews: IReviewColumn[] = reviews
    ? reviews?.map((review) => ({
        id: review.id,
        createdAt: formateDate(review.createdAt),
        rating: Array.from({ length: review.rating })
          .map(() => '⭐')
          .join(' '),
        username: review.user.name,
      }))
    : [];

  return (
    <div className='p-6'>
      {isLoadingReviews ? (
        <DataTableLoading />
      ) : (
        <div className='flex items-center justify-between'>
          <Heading
            title={`Reviews (${formattedReviews.length})`}
            description='All reviews from store'
          />
        </div>
      )}
      <div className='mt-3'>
        <DataTable
          columns={reviewColumns}
          data={formattedReviews}
          filterKey='username'
        />
      </div>
    </div>
  );
}
