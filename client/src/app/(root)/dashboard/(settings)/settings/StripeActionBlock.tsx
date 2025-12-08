'use client';

import { Button } from '@/components/ui/Button';
import React from 'react';

interface StripeActionBlockProps {
  title?: string;
  description?: string;
  buttonText: string;
  onButtonClick: () => void;
}

export const StripeActionBlock: React.FC<StripeActionBlockProps> = ({
  title,
  description = '',
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className='rounded-md border border-shop-green-hover bg-shop-green-hover p-4'>
      <p className='mb-3 text-xl font-semibold'>{title}</p>
      <p className='mb-4 text-sm whitespace-pre-line text-neutral-700'>
        {description}
      </p>
      <Button
        variant='primary'
        onClick={onButtonClick}
        className='rounded-md px-4 py-2 font-medium'
      >
        {buttonText}
      </Button>
    </div>
  );
};
