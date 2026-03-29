// src/types/chat.ts

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  isStreaming?: boolean;   // true пока идёт генерация
  wasStopped?: boolean;    // true если пользователь нажал Stop
  toolActivity?: string;   // "🔍 Ищу товары..." пока агент вызывает инструмент
  createdAt: Date;
}

export type ChatStatus =
  | 'idle'        // не подключён
  | 'connecting'  // идёт подключение WebSocket
  | 'connected'   // готов к работе
  | 'streaming'   // агент генерирует ответ
  | 'error';      // ошибка подключения
