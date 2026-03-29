// src/components/chat/ChatInput.tsx
'use client';

import { useState, useRef, KeyboardEvent, useCallback } from 'react';
import { SendHorizonal, Square, Loader2 } from 'lucide-react';
import { ChatStatus } from '@/types/chat';
import { cn } from '@/utils/common';

interface Props {
  status: ChatStatus;
  onSend: (message: string) => void;
  onStop: () => void;
  placeholder?: string;
}

export function ChatInput({ status, onSend, onStop, placeholder }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isStreaming = status === 'streaming';
  const isConnecting = status === 'connecting';
  const isConnected = status === 'connected' || status === 'streaming';
  const canSend = value.trim().length > 0 && isConnected && !isStreaming;

  const handleSend = useCallback(() => {
    if (!canSend) return;
    const msg = value.trim();
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    onSend(msg);
  }, [canSend, value, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      isStreaming ? onStop() : handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className='bg-background/80 border-t p-3 backdrop-blur-sm'>
      <div className='flex items-end gap-2'>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          rows={1}
          disabled={!isConnected}
          placeholder={
            isConnecting
              ? 'Подключение...'
              : isStreaming
                ? 'Enter или ■ — остановить'
                : (placeholder ?? 'Напишите запрос...')
          }
          className={cn(
            'bg-muted/40 flex-1 resize-none rounded-xl border px-3.5 py-2.5',
            'placeholder:text-muted-foreground text-sm leading-relaxed',
            'focus:ring-ring/50 focus:ring-2 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-40',
            'max-h-[160px] min-h-[42px]'
          )}
        />

        {/* Send ↔ Stop кнопка */}
        <button
          onClick={isStreaming ? onStop : handleSend}
          disabled={!isStreaming && !canSend}
          title={isStreaming ? 'Остановить (Enter)' : 'Отправить (Enter)'}
          className={cn(
            'flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-xl',
            'transition-all duration-150 select-none',
            isStreaming
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer shadow-sm active:scale-95'
              : canSend
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm active:scale-95'
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
          )}
        >
          {isConnecting ? (
            <Loader2 size={16} className='animate-spin' />
          ) : isStreaming ? (
            <Square size={14} fill='currentColor' strokeWidth={0} />
          ) : (
            <SendHorizonal size={15} />
          )}
        </button>
      </div>

      <p className='text-muted-foreground/50 mt-1.5 ml-1 text-[10px] select-none'>
        {isStreaming
          ? 'Enter или ■ — остановить'
          : 'Enter — отправить · Shift+Enter — новая строка'}
      </p>
    </div>
  );
}
