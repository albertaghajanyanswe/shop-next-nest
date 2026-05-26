'use client';

import { MessageCircle } from 'lucide-react';

interface ChatToggleButtonProps {
  onOpen: () => void;
  t: (key: string) => string;
}

export function ChatToggleButton({ onOpen, t }: ChatToggleButtonProps) {
  return (
    <button
      onClick={onOpen}
      className='bg-shop-primary hover:bg-shop-btn-primary fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-110'
      aria-label={t('open_chat')}
    >
      <MessageCircle className='h-6 w-6' />
    </button>
  );
}
