// src/components/chat/ChatFloatingButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ChatWidget } from './ChatWidget';
import { cn } from '@/utils/common';
import { getAccessToken } from '@/services/auth/auth-token.service';

interface Props {
  /** Заголовок виджета */
  title?: string;
  /** Placeholder в поле ввода */
  placeholder?: string;
  /** Позиция кнопки */
  position?: 'bottom-right' | 'bottom-left';
}

/**
 * ChatFloatingButton — плавающая кнопка чата.
 * Добавить в app/layout.tsx (один раз для всего приложения):
 *
 *   const token = // твой способ получить токен
 *   <ChatFloatingButton token={token} />
 */
export function ChatFloatingButton({
  title = 'AI Ассистент',
  placeholder,
  position = 'bottom-right',
}: Props) {
  const accessToken = getAccessToken();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const side =
    position === 'bottom-right' ? 'right-4 sm:right-6' : 'left-4 sm:left-6';

  return (
    <>
      {/* Chat panel */}
      <div
        className={cn(
          'fixed bottom-20 z-50',
          side,
          'h-[540px] w-[360px]',
          'max-sm:h-[70dvh] max-sm:w-[calc(100vw-24px)]',
          'origin-bottom-right transition-all duration-300 ease-out',
          isOpen
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-2 scale-95 opacity-0'
        )}
      >
        {isOpen && (
          <ChatWidget
            token={accessToken}
            title={title}
            placeholder={placeholder}
            className='h-full w-full'
          />
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Закрыть чат' : 'Открыть чат'}
        className={cn(
          'fixed bottom-4 z-50',
          side,
          'h-14 w-14 rounded-full shadow-xl',
          'bg-primary text-primary-foreground',
          'flex items-center justify-center',
          'hover:scale-110 active:scale-95',
          'transition-transform duration-200',
          'ring-primary/20 ring-4'
        )}
      >
        <div
          className={cn(
            'transition-transform duration-300',
            isOpen ? 'rotate-90' : 'rotate-0'
          )}
        >
          {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        </div>
      </button>
    </>
  );
}
