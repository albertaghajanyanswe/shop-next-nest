'use client';

import { Send, Loader2, Trash2 } from 'lucide-react';
import type { ChatMessage } from './useAiChat';

interface ChatInputProps {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  isConnected: boolean;
  isStreaming: boolean;
  messages: ChatMessage[];
  clearMessages: () => void;
  abortStream: () => void;
  handleSend: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  t: (key: string) => string;
}

export function ChatInput({
  inputRef,
  isConnected,
  isStreaming,
  messages,
  clearMessages,
  abortStream,
  handleSend,
  handleKeyPress,
  t,
}: ChatInputProps) {
  return (
    <div className='rounded-b-lg border-t border-neutral-200 bg-white p-4'>
      {messages.length > 0 && (
        <button
          onClick={clearMessages}
          className='text-shop-light-color hover:text-shop-dark-color mb-2 flex items-center gap-1 text-xs transition-colors'
        >
          <Trash2 className='h-3 w-3' />
          {t('clear_chat')}
        </button>
      )}
      <div className='flex gap-2'>
        <textarea
          ref={inputRef}
          onKeyPress={handleKeyPress}
          placeholder={t('input_placeholder')}
          disabled={!isConnected || isStreaming}
          className='focus:border-shop-primary flex-1 resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-100'
          rows={1}
        />
        <button
          onClick={isStreaming ? abortStream : handleSend}
          disabled={!isConnected || isStreaming}
          className='bg-shop-primary hover:bg-shop-btn-primary flex h-10 w-10 items-center justify-center self-end rounded-lg text-white transition-colors disabled:cursor-not-allowed disabled:bg-neutral-300'
          aria-label={isStreaming ? t('stop') : t('send')}
        >
          {isStreaming ? (
            <Loader2 className='h-5 w-5 animate-spin' />
          ) : (
            <Send className='h-5 w-5' />
          )}
        </button>
      </div>
    </div>
  );
}
