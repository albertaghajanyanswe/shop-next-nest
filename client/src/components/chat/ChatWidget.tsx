// src/components/chat/ChatWidget.tsx
'use client';

import { useEffect, useRef } from 'react';
import { ChatMessageItem } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Bot, Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/common';
import { useChat } from '@/hooks/chat/useChat';

interface Props {
  /** JWT токен пользователя — из твоей системы авторизации */
  token: string | null | undefined;
  /** Опциональный заголовок чата */
  title?: string;
  /** Placeholder в поле ввода */
  placeholder?: string;
  className?: string;
}

/**
 * ChatWidget — встроенный виджет чата.
 *
 * Использование:
 *   const token = useAuthToken() // твой способ получения токена
 *   <ChatWidget token={token} title="AI Ассистент" />
 */
export function ChatWidget({
  token,
  title = 'AI Ассистент',
  placeholder,
  className,
}: Props) {
  const { messages, status, error, sendMessage, stopGeneration } =
    useChat(token);
  console.log('STATUS = ', status)
  const messagesRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Автоскролл вниз при новых чанках
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (isAtBottom) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const statusConfig = {
    idle: {
      label: 'Не подключён',
      color: 'text-muted-foreground',
      spin: false,
    },
    connecting: {
      label: 'Подключение...',
      color: 'text-amber-500',
      spin: true,
    },
    connected: { label: 'Онлайн', color: 'text-emerald-500', spin: false },
    streaming: { label: 'Генерирует...', color: 'text-primary', spin: true },
    error: { label: 'Ошибка', color: 'text-destructive', spin: false },
  }[status];

  return (
    <div
      className={cn(
        'bg-background ring-border/50 flex flex-col overflow-hidden rounded-2xl border shadow-lg ring-1',
        className
      )}
    >
      {/* Header */}
      <div className='bg-muted/20 flex flex-shrink-0 items-center gap-3 border-b px-4 py-3'>
        <div className='bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full'>
          <Bot size={16} className='text-primary' />
        </div>
        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-semibold'>{title}</p>
          <div className={cn('flex items-center gap-1.5', statusConfig.color)}>
            {status === 'error' ? (
              <WifiOff size={10} />
            ) : statusConfig.spin ? (
              <Loader2 size={10} className='animate-spin' />
            ) : (
              <Wifi size={10} />
            )}
            <span className='text-[11px]'>{statusConfig.label}</span>
          </div>
        </div>
        <span className='bg-primary/10 text-primary flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium'>
          AI Agent
        </span>
      </div>

      {/* Messages */}
      <div
        ref={messagesRef}
        className='min-h-0 flex-1 space-y-3 overflow-y-auto p-4'
        style={{ scrollbarWidth: 'thin' }}
      >
        {messages.length === 0 && status === 'connecting' && (
          <div className='flex h-full items-center justify-center py-12'>
            <div className='text-muted-foreground space-y-2 text-center'>
              <Loader2 size={28} className='mx-auto animate-spin' />
              <p className='text-sm'>Подключение к ассистенту...</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}

        {error && (
          <div className='text-destructive bg-destructive/10 flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs'>
            <AlertCircle size={13} className='mt-0.5 flex-shrink-0' />
            <span>{error}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className='flex-shrink-0'>
        <ChatInput
          status={status}
          onSend={sendMessage}
          onStop={stopGeneration}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
