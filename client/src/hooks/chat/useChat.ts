// src/hooks/useChat.ts
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatStore } from '@/stores/chat.store';

// ── WebSocket event names (зеркалят backend gateway) ────────────────────
const WS_EVENTS = {
  // client → server
  JOIN: 'chat:join',
  MESSAGE: 'chat:message',
  STOP: 'chat:stop',
  // server → client
  JOINED: 'chat:joined',
  CHUNK: 'chat:chunk',
  TOOL: 'chat:tool',
  DONE: 'chat:done',
  STOPPED: 'chat:stopped',
  ERROR: 'chat:error',
} as const;

// Что показывать в UI пока агент вызывает инструмент
const TOOL_LABELS: Record<string, string> = {
  search_products: '🔍 Ищу товары в каталоге...',
};

const WS_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:4000';
const SESSION_STORAGE_KEY = 'ai_chat_session_id';

/**
 * useChat — хук для работы с AI агентом.
 *
 * @param token — JWT токен пользователя.
 *   Передаётся серверу при WebSocket подключении.
 *   Бэкенд достаёт userId из токена в handleConnection().
 *
 * Пример получения токена:
 *   const { data: session } = useSession()        // NextAuth
 *   const token = session?.accessToken
 *
 *   const token = useAuthStore((s) => s.token)    // кастомный стор
 */
export function useChat(token: string | null | undefined) {
  const socketRef = useRef<Socket | null>(null);
  const streamingMsgIdRef = useRef<string | null>(null);
  const isInitRef = useRef(false);

  const {
    messages,
    status,
    sessionId,
    error,
    setStatus,
    setSessionId,
    setError,
    addUserMessage,
    startAssistantMessage,
    appendChunk,
    setToolActivity,
    finalizeMessage,
  } = useChatStore();

  // ── Connect WebSocket ─────────────────────────────────────────────────
  useEffect(() => {
    console.log('\n\n token = ', token);
    console.log('isInitRef = ', isInitRef.current);
    // Не подключаемся без токена
    if (!token || isInitRef.current) return;
    isInitRef.current = true;

    setStatus('connecting');
    console.log('token = ', token);
    const socket = io(`${WS_URL}/chat`, {
      transports: ['websocket', 'polling'],
      // JWT передаётся в auth — бэкенд читает из client.handshake.auth.token
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1500,
    });

    socketRef.current = socket;
    console.log('1111111111')
    // ── Connection ──────────────────────────────────────────────────────
    socket.on('connect', () => {
      // Восстанавливаем предыдущую сессию если есть
      const savedSessionId =
        localStorage.getItem(SESSION_STORAGE_KEY) ?? undefined;
      socket.emit(WS_EVENTS.JOIN, { sessionId: savedSessionId });
    });
    console.log('22222222')

    socket.on(WS_EVENTS.JOINED, ({ sessionId: sid }: { sessionId: string }) => {
      setSessionId(sid);
      setStatus('connected');
      localStorage.setItem(SESSION_STORAGE_KEY, sid);

      // Приветственное сообщение при первом входе
      const hasMessages = useChatStore.getState().messages.length > 0;
      if (!hasMessages) {
        const msgId = startAssistantMessage();
        const welcome =
          '👋 Привет! Опишите что ищете — бренд, характеристики, бюджет. Найду подходящие товары.';
        let i = 0;
        const timer = setInterval(() => {
          if (i < welcome.length) {
            appendChunk(msgId, welcome[i++]);
          } else {
            clearInterval(timer);
            finalizeMessage(msgId);
          }
        }, 10);
      }
    });
    console.log('33333333')

    socket.on('disconnect', () => setStatus('idle'));

    socket.on('connect_error', () => {
      setStatus('error');
      setError('Не удалось подключиться к серверу. Обновите страницу.');
    });

    // ── Streaming events ────────────────────────────────────────────────
    console.log('44444444')

    // Агент вызвал инструмент → показываем индикатор в UI
    socket.on(WS_EVENTS.TOOL, ({ tool }: { tool: string }) => {
      const msgId = streamingMsgIdRef.current;
      if (!msgId) return;
      setToolActivity(msgId, TOOL_LABELS[tool] ?? `⚙️ ${tool}...`);
    });
    console.log('5555555')

    // Текстовый чанк → добавляем к сообщению ассистента
    socket.on(WS_EVENTS.CHUNK, ({ chunk }: { chunk: string }) => {
      const msgId = streamingMsgIdRef.current;
      if (!msgId) return;
      setToolActivity(msgId, undefined); // убираем индикатор инструмента
      appendChunk(msgId, chunk);
    });

    // Генерация завершена нормально
    socket.on(WS_EVENTS.DONE, () => {
      const msgId = streamingMsgIdRef.current;
      if (msgId) {
        finalizeMessage(msgId, { wasStopped: false });
        streamingMsgIdRef.current = null;
      }
      setStatus('connected');
    });

    // Пользователь нажал Stop
    socket.on(WS_EVENTS.STOPPED, () => {
      const msgId = streamingMsgIdRef.current;
      if (msgId) {
        finalizeMessage(msgId, { wasStopped: true });
        streamingMsgIdRef.current = null;
      }
      setStatus('connected');
    });

    // Ошибка от сервера
    socket.on(WS_EVENTS.ERROR, ({ message }: { message: string }) => {
      const msgId = streamingMsgIdRef.current;
      if (msgId) {
        finalizeMessage(msgId);
        streamingMsgIdRef.current = null;
      }
      setError(message);
      setStatus('connected');
    });

    return () => {
      socket.disconnect();
      isInitRef.current = false;
    };
  }, [token]);

  // ── Send message ──────────────────────────────────────────────────────
  const sendMessage = useCallback((content: string) => {
    const { sessionId: sid, status: st } = useChatStore.getState();

    if (!socketRef.current || !sid) return;
    if (st === 'streaming') return;
    if (!content.trim()) return;

    setError(null);
    addUserMessage(content.trim());

    // Создаём пустое сообщение ассистента — оно будет наполняться чанками
    const msgId = startAssistantMessage();
    streamingMsgIdRef.current = msgId;
    setStatus('streaming');

    socketRef.current.emit(WS_EVENTS.MESSAGE, {
      sessionId: sid,
      content: content.trim(),
    });
  }, []);

  // ── Stop generation ───────────────────────────────────────────────────
  const stopGeneration = useCallback(() => {
    const { sessionId: sid } = useChatStore.getState();
    if (!socketRef.current || !sid) return;
    socketRef.current.emit(WS_EVENTS.STOP, { sessionId: sid });
  }, []);

  return {
    messages,
    status,
    sessionId,
    error,
    sendMessage,
    stopGeneration,
    isStreaming: status === 'streaming',
    isConnected: status === 'connected' || status === 'streaming',
  };
}
