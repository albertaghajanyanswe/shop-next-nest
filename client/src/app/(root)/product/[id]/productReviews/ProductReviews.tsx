import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { ReviewModal } from '@/components/modals/ReviewModal';
import { Button } from '@/components/ui/Button';
import { useDeleteReview } from '@/hooks/queries/reviews/useDeleteReview';
import { useProfile } from '@/hooks/useProfile';
import { generateImgPath } from '@/utils/imageUtils';
import { CirclePlus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Rating } from 'react-simple-star-rating';
import { GetProductWithDetails } from '@/generated/orval/types';
import { formatDateWithHour } from '@/utils/formateDate';
import NoDataFound from '@/components/customComponents/loading/NoDataFound';
import { ShowMoreText } from '@/components/customComponents/ShowMoreText';
import { memo } from 'react';

export interface ProductReviewsProps {
  product: GetProductWithDetails;
}

function ProductReviews({ product }: ProductReviewsProps) {
  const { user } = useProfile();
  const { deleteReview, isLoadingDelete } = useDeleteReview();

  return (
    <div className='mt-2'>
      <div className='flex items-center justify-between'>
        <p className='text-2xl font-semibold'>Reviews</p>
        {user && (
          <ReviewModal storeId={product.storeId as string}>
            <Button variant='secondary'>
              <CirclePlus className='mr-2 size-5' />
              Add review
            </Button>
          </ReviewModal>
        )}
      </div>
      <div className='flex flex-col gap-6 rounded-xl bg-shop-white py-3'>
        {!!product?.reviews?.length ? (
          product.reviews.map((review) => (
            <div key={review.id} className='flex items-start justify-between'>
              <div className='relative rounded-md' key={review.id}>
                <div className='mb-2 flex items-center gap-2'>
                  <Rating
                    initialValue={review.rating}
                    readonly
                    SVGstyle={{ display: 'inline-block' }}
                    size={16}
                    allowFraction
                    transition
                    className='m-0 p-0'
                  />
                  <p className='mt-[2px] text-sm font-semibold'>
                    {review.user.name}
                  </p>
                  <p className='mt-[2px] text-xs font-semibold'>-</p>
                  <p className='text-muted-foreground mt-[2px] text-xs font-semibold'>
                    {formatDateWithHour(review.createdAt)}
                  </p>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-x-4 font-medium'>
                    <Image
                      src={
                        generateImgPath(review.user?.picture || '') ||
                        '/images/no-user-image.png'
                      }
                      alt={review.user.name}
                      width={40}
                      height={40}
                      className='h-10 w-10 rounded-full'
                    />
                    <div>
                      <ShowMoreText
                        className='text-muted-foreground text-sm'
                        text={review.text}
                        maxLength={150}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {user?.id === review.user.id && (
                <ConfirmModal handleConfirm={() => deleteReview(review.id)}>
                  <Button
                    variant='ghost'
                    className='text-red-500 hover:bg-red-500/5'
                    disabled={isLoadingDelete}
                  >
                    <Trash2 className='size-4 text-red-500 hover:text-red-600' />
                  </Button>
                </ConfirmModal>
              )}
            </div>
          ))
        ) : (
          <NoDataFound entityName='Reviews' />
        )}
      </div>
    </div>
  );
}

export default memo(ProductReviews);
