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
    <div className='from-primary-100 to-primary-400 dark:from-primary-200 dark:to-primary-600 rounded-md border bg-linear-to-r p-4'>
      <p className='mb-3 text-xl font-semibold text-neutral-900'>{title}</p>
      <div className='mb-4 text-sm leading-relaxed whitespace-pre-line text-neutral-900'>
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
