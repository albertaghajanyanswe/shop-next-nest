'use client';

import { MessageCircle, X } from 'lucide-react';

interface ChatHeaderProps {
  isConnected: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

export function ChatHeader({ isConnected, onClose, t }: ChatHeaderProps) {
  return (
    <div className='bg-shop-primary flex items-center justify-between rounded-t-lg px-4 py-3 text-white'>
      <div className='flex items-center gap-2'>
        <MessageCircle className='h-5 w-5' />
        <h3 className='font-semibold'>{t('assistant_title')}</h3>
      </div>
      <div className='flex items-center gap-2'>
        {isConnected ? (
          <div
            className='bg-shop-light-primary h-2 w-2 rounded-full'
            title={t('connected')}
          />
        ) : (
          <div
            className='bg-shop-red h-2 w-2 rounded-full'
            title={t('disconnected')}
          />
        )}
        <button
          onClick={onClose}
          className='hover:bg-shop-btn-primary rounded-full p-1 transition-colors'
          aria-label={t('close_chat')}
        >
          <X className='h-5 w-5' />
        </button>
      </div>
    </div>
  );
}
