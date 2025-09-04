'use client';

import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface IHeadingProps {
  title: string;
  description?: string;
  className?: string;
  showBackButton?: boolean;
}

export function Heading({ title, description, className, showBackButton = true }: IHeadingProps) {
  const router = useRouter();
  const back = () => {
    router.back();
  };
  return (
    <div className='flex items-center gap-x-2'>
      {showBackButton && (
        <ArrowLeft className='size-5 cursor-pointer' onClick={back} />
      )}
      <div className='space-y-1'>
        <h2 className={cn('text-2xl font-medium', className)}>{title}</h2>
        {description && (
          <p className='text-muted-foreground text-sm'>{description}</p>
        )}
      </div>
    </div>
  );
}
