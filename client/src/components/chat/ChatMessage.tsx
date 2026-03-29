// src/components/chat/ChatMessage.tsx
'use client';

import { ChatMessage } from '@/types/chat';
import { cn } from '@/utils/common';
import { Bot, User, StopCircle, Loader2 } from 'lucide-react';

interface Props {
  message: ChatMessage;
}

// Рендер минимального markdown: **bold** и переносы строк
function renderContent(text: string) {
  return text.split('\n').map((line, lineIdx, lines) => (
    <span key={lineIdx}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className='font-semibold'>
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
      {lineIdx < lines.length - 1 && <br />}
    </span>
  ));
}

export function ChatMessageItem({ message }: Props) {
  const isUser = message.role === 'user';
  const { isStreaming, wasStopped, toolActivity, content } = message;
  const isEmpty = content === '' && !toolActivity;

  return (
    <div
      className={cn(
        'animate-in fade-in slide-in-from-bottom-1 flex items-end gap-2.5 duration-200',
        isUser && 'flex-row-reverse'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'mb-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        )}
      >
        {isUser ? <User size={13} /> : <Bot size={13} />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-secondary text-secondary-foreground rounded-bl-sm'
        )}
      >
        {/* Tool activity indicator */}
        {toolActivity && (
          <div className='mb-1.5 flex items-center gap-1.5 text-xs opacity-70'>
            <Loader2 size={11} className='flex-shrink-0 animate-spin' />
            <span>{toolActivity}</span>
          </div>
        )}

        {/* Content */}
        {content && <span>{renderContent(content)}</span>}

        {/* Streaming cursor — мигает пока идёт генерация */}
        {isStreaming && !toolActivity && !isEmpty && (
          <span className='ml-0.5 inline-block h-3.5 w-0.5 animate-[blink_1s_step-end_infinite] rounded-sm bg-current align-text-bottom' />
        )}

        {/* Пустое состояние — три точки пока нет текста */}
        {isEmpty && isStreaming && !toolActivity && (
          <span className='flex items-center gap-1 py-0.5'>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className='h-1.5 w-1.5 animate-bounce rounded-full bg-current opacity-60'
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        )}

        {/* Stopped badge */}
        {wasStopped && (
          <div className='mt-1.5 flex items-center gap-1 text-[11px] opacity-40'>
            <StopCircle size={10} />
            <span>остановлено</span>
          </div>
        )}
      </div>
    </div>
  );
}
