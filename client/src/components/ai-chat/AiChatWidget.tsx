'use client';

import { useState, useRef, useEffect } from 'react';
import { useAiChat } from './useAiChat';
import { categoryService } from '@/services/category.service';
import { GetCategoryDto } from '@/generated/orval/types';
import { useTranslations } from 'next-intl';
import { ChatToggleButton } from './ChatToggleButton';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

export function AiChatWidget() {
  const t = useTranslations('AiChat');
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      {!isOpen && <ChatToggleButton onOpen={() => setIsOpen(true)} t={t} />}

      {isOpen && (
        <div className='fixed right-6 bottom-6 z-50 flex h-[600px] w-[400px] flex-col rounded-xl bg-white shadow-2xl'>
          <ChatHeader
            isConnected={isConnected}
            onClose={() => setIsOpen(false)}
            t={t}
          />

          <ChatMessages
            messages={messages}
            isStreaming={isStreaming}
            error={error}
            categories={categories}
            sendMessage={sendMessage}
            messagesEndRef={messagesEndRef}
            t={t}
          />

          <ChatInput
            inputRef={inputRef}
            isConnected={isConnected}
            isStreaming={isStreaming}
            messages={messages}
            clearMessages={clearMessages}
            abortStream={abortStream}
            handleSend={handleSend}
            handleKeyPress={handleKeyPress}
            t={t}
          />
        </div>
      )}
    </>
  );
}
