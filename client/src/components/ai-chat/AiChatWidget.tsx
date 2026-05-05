'use client';

import { useState, useRef, useEffect } from 'react';
import { useAiChat } from './useAiChat';
import { ChatProductCard } from './ChatProductCard';
import { MessageCircle, X, Send, Loader2, Trash2 } from 'lucide-react';
import { categoryService } from '@/services/category.service';
import { GetCategoryDto } from '@/generated/orval/types';

export function AiChatWidget() {
  const [categories, setCategories] = useState<GetCategoryDto[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await categoryService.getAll({ limit: 5, skip: 0 });
        if (res && res.categories) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    }
    fetchCategories();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isConnected,
    isStreaming,
    sendMessage,
    abortStream,
    clearMessages,
    error,
  } = useAiChat();
  console.log('messages = ', messages);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    const value = inputRef.current?.value.trim();
    if (!value || isStreaming) return;

    sendMessage(value);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className='bg-shop-primary hover:bg-shop-btn-primary fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-110'
          aria-label='Open AI Chat'
        >
          <MessageCircle className='h-6 w-6' />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className='fixed right-6 bottom-6 z-50 flex h-[600px] w-[400px] flex-col rounded-xl bg-white shadow-2xl'>
          {/* Header */}
          <div className='bg-shop-primary flex items-center justify-between rounded-t-lg px-4 py-3 text-white'>
            <div className='flex items-center gap-2'>
              <MessageCircle className='h-5 w-5' />
              <h3 className='font-semibold'>AI Shopping Assistant</h3>
            </div>
            <div className='flex items-center gap-2'>
              {isConnected ? (
                <div
                  className='bg-shop-light-primary h-2 w-2 rounded-full'
                  title='Connected'
                />
              ) : (
                <div
                  className='bg-shop-red h-2 w-2 rounded-full'
                  title='Disconnected'
                />
              )}
              <button
                onClick={() => setIsOpen(false)}
                className='hover:bg-shop-btn-primary rounded-full p-1 transition-colors'
                aria-label='Close chat'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className='flex flex-1 flex-col space-y-4 overflow-y-auto bg-white p-4'>
            {messages.length === 0 && (
              <div className='flex flex-1 flex-col items-center justify-center px-4'>
                <div className='relative -mt-10 mb-4 flex h-40 w-40 items-center justify-center'>
                  {/* Glowing orb layers */}
                  <div className='bg-shop-light-primary/20 absolute inset-0 animate-pulse rounded-full blur-xl'></div>
                  <div className='bg-shop-light-primary/30 absolute inset-3 rounded-full blur-md'></div>
                  <div className='from-shop-light-primary to-shop-primary absolute inset-6 rounded-full bg-linear-to-br shadow-[0_0_40px_shop-primary]'></div>
                  <div className='absolute inset-8 rounded-full bg-white/40 blur-[6px]'></div>
                  {/* Orb highlight */}
                  <div className='absolute top-10 left-10 h-8 w-14 -rotate-45 rounded-full bg-white/60 blur-sm'></div>
                </div>

                <h2 className='text-center text-2xl leading-[1.2] font-semibold tracking-tight text-black'>
                  What can I help you
                  <br />
                  with today ?
                </h2>

                {categories && categories.length > 0 && (
                  <div className='mt-8 flex flex-wrap justify-center gap-2'>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => sendMessage(category.name)}
                        className='bg-primary/10 hover:bg-primary/20 text-primary rounded-full border border-primary px-2 py-1 text-xs transition-colors'
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
                  message.role === 'user'
                    ? 'justify-end'
                    : 'justify-start gap-2'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className='bg-shop-light-bg flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-black'>
                    AI
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
                    <p className='text-sm break-words whitespace-pre-wrap'>
                      {message.content}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isStreaming && (
              <div className='text-shop-light-color flex items-center justify-start gap-2'>
                <div className='bg-shop-light-bg flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-black'>
                  AI
                </div>
                <div className='flex items-center gap-1 text-sm italic'>
                  <span>typing the answer of your question</span>
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

          {/* Input */}
          <div className='rounded-b-lg border-t border-neutral-200 bg-white p-4'>
            {messages.length > 0 && (
              <button
                onClick={clearMessages}
                className='text-shop-light-color hover:text-shop-dark-color mb-2 flex items-center gap-1 text-xs transition-colors'
              >
                <Trash2 className='h-3 w-3' />
                Clear chat
              </button>
            )}
            <div className='flex gap-2'>
              <textarea
                ref={inputRef}
                onKeyPress={handleKeyPress}
                placeholder='Ask me something'
                disabled={!isConnected || isStreaming}
                className='text-neutral-900 focus:border-shop-primary flex-1 resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-100'
                rows={1}
              />
              <button
                onClick={isStreaming ? abortStream : handleSend}
                disabled={!isConnected || isStreaming}
                className='bg-shop-primary hover:bg-shop-btn-primary flex h-10 w-10 items-center justify-center self-end rounded-lg text-white transition-colors disabled:cursor-not-allowed disabled:bg-neutral-300'
                aria-label={isStreaming ? 'Stop' : 'Send'}
              >
                {isStreaming ? (
                  <Loader2 className='h-5 w-5 animate-spin' />
                ) : (
                  <Send className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
