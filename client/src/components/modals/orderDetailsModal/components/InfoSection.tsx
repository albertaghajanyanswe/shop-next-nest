import React, { memo } from 'react';
import { InfoSectionItem } from '../OrderDetailsModal';

interface InfoSectionProps {
  items: InfoSectionItem[];
  className?: string;
}

export function InfoSection({ items, className = '' }: InfoSectionProps) {
  return (
    <div
      className={`space-y-1 text-xs ${className} bg-shop-green-hover xs:max-w-none max-w-fit rounded-md p-3`}
    >
      {items.map((item, idx) => (
        <p key={idx} className={`${item.className && item.className} flex`}>
          <span className='flex-2 font-semibold'>{item.title}:</span>
          <span className='text-shop-muted-text-6 ml-2 flex-5 font-medium wrap-anywhere'>
            {item.value}
          </span>
        </p>
      ))}
    </div>
  );
}

export default memo(InfoSection);
