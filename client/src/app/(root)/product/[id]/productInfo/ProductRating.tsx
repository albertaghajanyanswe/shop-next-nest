import { GetReviewWithUserDto } from '@/generated/orval/types';

export const ProductRating = ({
  productReviews,
  leftTitle,
  className=''
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
      {leftTitle && <h3 className='font-medium text-neutral-700'>{leftTitle}</h3>}
      <div className='text-sm'>
        ⭐ {rating.toFixed(1) || ' '}
        <span className='text-muted-foreground'>{` • ${productReviews?.length} reviews`}</span>
      </div>
    </div>
  );
};
