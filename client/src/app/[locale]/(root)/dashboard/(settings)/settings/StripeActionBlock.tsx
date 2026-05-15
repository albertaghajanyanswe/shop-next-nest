'use client';

import { Button } from '@/components/ui/Button';
import React from 'react';

interface StripeActionBlockProps {
  title?: string;
  description?: string | React.ReactNode;
  buttonText: string;
  onButtonClick: () => void;
  btnDisabled?: boolean;
}

export const StripeActionBlock: React.FC<StripeActionBlockProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
  btnDisabled = false,
}) => {
  return (
    <div className='card-linear-grad dark:card-flame rounded-md border bg-linear-to-r p-4'>
      <p className='mb-3 text-xl font-semibold text-white'>{title}</p>
      <div className='mb-4 text-sm leading-relaxed whitespace-pre-line text-white'>
        {description}
      </div>
      <Button
        disabled={btnDisabled}
        variant='default'
        onClick={onButtonClick}
        className='rounded-md px-4 py-2 font-medium'
      >
        {buttonText}
      </Button>
    </div>
  );
};
