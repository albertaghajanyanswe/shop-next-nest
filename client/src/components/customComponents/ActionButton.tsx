import React from 'react';
import '@components/ActionButton/actionButton.scss';

interface ActionButtonProps {
  onClick: any;
  icon: React.ReactNode;
  title: string;
  rightText?: number;
  buttonClassName?: string;
}

export function ActionButton({
  onClick,
  icon,
  title,
  rightText,
  buttonClassName = '',
}: ActionButtonProps) {
  return (
    <div
      onClick={onClick}
      className={`action-button bg-neutral100 relative flex cursor-pointer justify-between rounded-lg px-[16px] py-[12px] ${buttonClassName}`}
    >
      <div className={`flex`}>
        {icon}
        <p className='text-neutral900 m-[0px] ml-2 text-sm font-normal'>
          {title}
        </p>
      </div>
      {rightText !== undefined && (
        <div className='flex'>
          <div className='text-neutral900 border-l-neutral400 m-[0px] ml-[8px] w-[60px] border-[0px] border-l border-solid pl-[8px] text-sm font-medium'>
            {rightText}
          </div>
        </div>
      )}
    </div>
  );
}
