'use client';

import { CalendarDays, Star } from 'lucide-react';
import { IReviewColumn } from './ReviewColumns';
import { ShowMoreText } from '@/components/customComponents/ShowMoreText';

interface AdminReviewCardProps {
  review: IReviewColumn & { text?: string };
  t: (key: string) => string;
}

export function AdminReviewCard({ review }: AdminReviewCardProps) {
  const starCount = review.rating?.split(' ').length ?? 0;

  return (
    <div className='bg-shop-white border-shop-primary/15 xs:p-4 flex flex-col gap-2 rounded-lg border p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'>
      {/* Header */}
      <div className='flex items-start justify-between gap-2'>
        <div className='flex items-center gap-2'>
          {/* Avatar initials */}
          <div className='bg-shop-primary/15 text-shop-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase'>
            {review.username?.charAt(0) ?? '?'}
          </div>
          <div>
            <p className='text-shop-primary-text text-xs font-semibold sm:text-sm'>
              {review.username}
            </p>
            <p className='text-muted-foreground flex items-center gap-1 text-[10px]'>
              <CalendarDays className='size-3' />
              {review.createdAt}
            </p>
          </div>
        </div>
        {/* Stars */}
        <div className='flex shrink-0 items-center gap-0.5'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-3.5 ${i < starCount ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`}
            />
          ))}
        </div>
      </div>

      {/* Text */}
      {review.text && (
        <ShowMoreText
          className='text-muted-foreground text-sm'
          text={review.text}
          maxLength={150}
        />
      )}
    </div>
  );
}
