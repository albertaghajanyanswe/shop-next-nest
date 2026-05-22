'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useTranslations } from 'next-intl';

export interface IShowMoreTextProps {
  text?: string;
  className?: string;
  onShowMore?: () => void;
  btnClass?: string;
  maxLength?: number;
}

export const ShowMoreText: React.FC<IShowMoreTextProps> = ({
  text = '',
  className = '',
  onShowMore = () => null,
  btnClass = '',
  maxLength = 250,
}) => {
  const t = useTranslations('ShowMoreText');
  const [showFull, setShowFull] = useState(false);

  const toggleShowFull = () =>
    setShowFull((prev) => {
      if (!prev) {
        onShowMore();
      }
      return !prev;
    });

  const isNeedShortenText = text && text.length > maxLength;

  const displayText = (() => {
    if (!isNeedShortenText) return text;

    return text.length > maxLength
      ? showFull
        ? text
        : `${text.slice(0, maxLength)}\n...`
      : text;
  })();

  return (
    <>
      <div className={`text-break mb-2 ${className}`}>{displayText}</div>

      {isNeedShortenText && (
        <Button
          variant='link'
          className={`m-0 mt-0 cursor-pointer p-0 font-semibold no-underline hover:underline ${btnClass}`}
          onClick={toggleShowFull}
        >
          {showFull ? t('show_less') : t('show_more')}
        </Button>
      )}
    </>
  );
};
