import React, { useState } from 'react';
import { Button } from '../ui/Button';

export interface IShowMoreTextProps {
  text?: string;
  className?: string;
  onShowMore?: () => void;
  btnClass?: string;
}

export const ShowMoreText: React.FC<IShowMoreTextProps> = ({
  text = '',
  className = '',
  onShowMore = () => null,
  btnClass = '',
}) => {
  const [showFull, setShowFull] = useState(false);

  const toggleShowFull = () =>
    setShowFull((prev) => {
      if (!prev) {
        onShowMore();
      }
      return !prev;
    });
  const calculatedMaxLength = 250;

  const isNeedShortenText = text && text.length > calculatedMaxLength;

  const displayText = (() => {
    if (!isNeedShortenText) return text;

    return text.length > calculatedMaxLength
      ? showFull
        ? text
        : `${text.slice(0, calculatedMaxLength)}\n...`
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
          {showFull ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </>
  );
};
