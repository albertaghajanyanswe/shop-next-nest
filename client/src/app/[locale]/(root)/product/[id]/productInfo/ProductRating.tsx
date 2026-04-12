import { GetReviewWithUserDto } from '@/generated/orval/types';
import { Star } from 'lucide-react';
import { memo } from 'react';

const ProductRatingComponent = ({
  productReviews,
  leftTitle,
  className = '',
}: {
  productReviews: GetReviewWithUserDto[];
  leftTitle?: string;
  className?: string;
}) => {
  const rating = productReviews
    ? Math.round(
        productReviews.reduce((acc, review) => acc + review.rating, 0) /
          productReviews.length
      ) || 0
    : 0;
  return (
    <div className={`flex items-center gap-x-4 ${className}`}>
      {leftTitle && (
        <p className='text-sm font-semibold whitespace-nowrap text-shop-muted-text-7'>
          {leftTitle}
        </p>
      )}

      <div className='flex w-full min-w-0 items-center justify-end gap-x-1 text-sm'>
        <Star className='size-5 shrink-0 fill-yellow-400 text-yellow-400' />

        <span className='shrink-0'>{rating.toFixed(1) || ' '}</span>

        <span className='text-muted-foreground truncate'>
          {` • ${productReviews?.length} reviews`}
        </span>
      </div>
    </div>
  );
};

export const ProductRating = memo(ProductRatingComponent);
