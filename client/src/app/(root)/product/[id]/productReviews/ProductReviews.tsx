import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { ReviewModal } from '@/components/modals/ReviewModal';
import { Button } from '@/components/ui/Button';
import { useDeleteReview } from '@/hooks/queries/reviews/useDeleteReview';
import { useProfile } from '@/hooks/useProfile';
import { IProduct } from '@/shared/types/product.interface';
import { Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Rating } from 'react-simple-star-rating';

export interface ProductReviewsProps {
  product: IProduct;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  const { user } = useProfile();
  const { deleteReview, isLoadingDelete } = useDeleteReview();

  return (
    <>
      <div className='mt-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Reviews</h1>
        {user && (
          <ReviewModal storeId={product.storeId}>
            <Button variant='ghost'>
              <Plus className='mr-2 size-4' />
              Add review
            </Button>
          </ReviewModal>
        )}
      </div>
      <div className='mt-4 grid gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
        {product?.reviews.length ? (
          product.reviews.map((review) => (
            <div className='rounded-lg border p-4' key={review.id}>
              <div className='flex justify-between'>
                <div className='flex items-center gap-x-4 font-medium'>
                  <Image
                    src={review.user.picture || '/images/no-user-image.png'}
                    alt={review.user.name}
                    width={40}
                    height={40}
                    className='h-10 w-10 rounded-full'
                  />
                  {review.user.name}
                </div>
                {user?.id === review.user.id && (
                  <ConfirmModal handleConfirm={() => deleteReview(review.id)}>
                    <Button variant='ghost' className='mt-3 text-red-500'>
                      <Trash2 className='text-red-500 hover:text-red-600 size-4' />
                    </Button>
                  </ConfirmModal>
                )}
              </div>
              <Rating
                initialValue={review.rating}
                readonly
                SVGstyle={{ display: 'inline-block' }}
                size={20}
                allowFraction
                transition
              />
              <div className='text-muted-foreground mt-1 text-sm'>
                {review.text}
              </div>
            </div>
          ))
        ) : (
          <div className='mt-4'>No reviews found</div>
        )}
      </div>
    </>
  );
}
