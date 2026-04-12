'use client';

import { DataTable } from '@/components/ui/dataLoading/DataTable';
import DataTableLoading from '@/components/ui/dataLoading/DataTableLoading';
import { Heading } from '@/components/ui/Heading';
import { useParams } from 'next/navigation';
import { formateDate } from '@/utils/formateDate';
import { useGetReviews } from '@/hooks/queries/reviews/useGetReviews';
import { IReviewColumn, reviewColumns } from './ReviewColumns';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { CustomPagination } from '@/components/customComponents/CustomPagination';
import { useTranslations } from 'next-intl';

export function Reviews() {
  const t = useTranslations('StorePages');
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { queryParams, changePage, changeLimit, changeSearch, changeSort } =
    useQueryParams({
      pageDefaultParams: {
        params: {
          sort: { field: 'createdAt', order: 'desc' },
          filter: {},
          limit: 10,
          skip: 0,
          search: {
            value: '',
            fields: ['name', 'description'],
          },
        },
      },
    });

  const { reviewsData, isLoadingReviewsData } = useGetReviews(queryParams);

  const formattedReviews: IReviewColumn[] = reviewsData?.reviews
    ? reviewsData?.reviews?.map((review) => ({
        id: review.id,
        createdAt: formateDate(review.createdAt),
        rating: Array.from({ length: review.rating })
          .map(() => '⭐')
          .join(' '),
        username: review.user.name,
        text: review.text,
      }))
    : [];

  const reviewColumnList = reviewColumns(t);

  return (
    <div className='p-6'>
      {isLoadingReviewsData ? (
        <DataTableLoading />
      ) : (
        <div className='flex items-center justify-between'>
          <Heading
            title={`${t('reviews_title')} (${reviewsData?.totalCount})`}
            description={t('reviews_description')}
          />
        </div>
      )}
      <div className='mt-3'>
        <DataTable
          columns={reviewColumnList}
          data={formattedReviews}
          filterKey='username'
          totalCount={reviewsData?.totalCount as number}
          queryParams={queryParams}
          onChangeSearch={changeSearch}
          onChangeSort={changeSort}
        />

        {!!reviewsData?.totalCount && (
          <CustomPagination
            limit={queryParams?.params?.limit as number}
            total={reviewsData?.totalCount as number}
            skip={queryParams?.params?.skip as number}
            onPageChange={changePage}
            onLimitChange={changeLimit}
          />
        )}
      </div>
    </div>
  );
}
