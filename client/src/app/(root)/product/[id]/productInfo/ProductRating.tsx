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
        <p className='text-sm font-semibold whitespace-nowrap text-neutral-700'>
          {leftTitle}
        </p>
      )}
      <div className='flex w-full place-content-end items-center gap-x-1 text-end text-sm'>
        <Star className='inline-block size-5 fill-yellow-400 text-yellow-400' />
        {rating.toFixed(1) || ' '}
        <span className='text-muted-foreground'>{` • ${productReviews?.length} reviews`}</span>
      </div>
    </div>
  );
};

export const ProductRating = memo(ProductRatingComponent);
