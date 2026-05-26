'use client';

import type { ChatMessage } from './useAiChat';
import { ChatProductCard } from './ChatProductCard';
import type { GetCategoryDto } from '@/generated/orval/types';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  categories: GetCategoryDto[];
  sendMessage: (text: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  t: (key: string) => string;
}

export function ChatMessages({
  messages,
  isStreaming,
  error,
  categories,
  sendMessage,
  messagesEndRef,
  t,
}: ChatMessagesProps) {
  return (
    <div className='flex flex-1 flex-col space-y-4 overflow-y-auto bg-white p-4'>
      {messages.length === 0 && (
        <div className='flex flex-1 flex-col items-center justify-center px-4'>
          <div className='relative -mt-10 mb-4 flex h-40 w-40 items-center justify-center'>
            <div className='bg-shop-light-primary/20 absolute inset-0 animate-pulse rounded-full blur-xl'></div>
            <div className='bg-shop-light-primary/30 absolute inset-3 rounded-full blur-md'></div>
            <div className='from-shop-light-primary to-shop-primary absolute inset-6 rounded-full bg-linear-to-br shadow-[0_0_40px_shop-primary]'></div>
            <div className='absolute inset-8 rounded-full bg-white/40 blur-[6px]'></div>
            <div className='absolute top-10 left-10 h-8 w-14 -rotate-45 rounded-full bg-white/60 blur-sm'></div>
          </div>

          <h2 className='text-center text-2xl leading-[1.2] font-semibold tracking-tight whitespace-pre-line text-black'>
            {t('greeting')}
          </h2>

          {categories && categories.length > 0 && (
            <div className='mt-8 flex flex-wrap justify-center gap-2'>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => sendMessage(category.name)}
                  className='bg-primary/10 hover:bg-primary/20 text-primary border-primary rounded-full border px-2 py-1 text-xs transition-colors'
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start gap-2'
          }`}
        >
          {message.role === 'assistant' && (
            <div className='bg-shop-light-bg flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-black'>
              {t('ai_label')}
            </div>
          )}
          {message.type === 'product_card' && message.productCard ? (
            <div className='min-w-0 flex-1'>
              <ChatProductCard product={message.productCard} />
            </div>
          ) : (
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-shop-primary text-white'
                  : 'text-shop-dark-color border border-neutral-200 bg-white'
              }`}
            >
              <p className='wrap-words text-sm whitespace-pre-wrap'>
                {message.content}
              </p>
            </div>
          )}
        </div>
      ))}

      {isStreaming && (
        <div className='text-shop-light-color flex items-center justify-start gap-2'>
          <div className='bg-shop-light-bg flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-black'>
            {t('ai_label')}
          </div>
          <div className='flex items-center gap-1 text-sm italic'>
            <span>{t('typing')}</span>
            <span className='inline-flex gap-0.5'>
              <span className='animate-bounceDot1'>.</span>
              <span className='animate-bounceDot2'>.</span>
              <span className='animate-bounceDot3'>.</span>
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className='bg-shop-red/10 border-shop-red/20 text-shop-red rounded-lg border px-4 py-2 text-sm'>
          {error}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
