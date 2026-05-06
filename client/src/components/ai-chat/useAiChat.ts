'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
  type?: 'text' | 'product_card';
  productCard?: any;
}

interface UseAiChatOptions {
  serverUrl?: string;
  autoConnect?: boolean;
}

interface UseAiChatReturn {
  messages: ChatMessage[];
  isConnected: boolean;
  isStreaming: boolean;
  sendMessage: (message: string) => void;
  abortStream: () => void;
  clearMessages: () => void;
  error: string | null;
}

export function useAiChat(options: UseAiChatOptions = {}): UseAiChatReturn {
  const { serverUrl = process.env.NEXT_PUBLIC_SERVER_URL, autoConnect = true } =
    options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const [showStreamingMessage, setShowStreamingMessage] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const sessionIdRef = useRef<string>(`session-${Date.now()}`);
  const streamingTextRef = useRef('');

  useEffect(() => {
    if (!autoConnect) return;

    const socket = io(`${serverUrl}/api/ai-chat`, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connected', (data) => {
      console.log('AI Chat connected:', data);
    });

    socket.on(
      'chat:stream',
      (data: {
        sessionId: string;
        type: 'text' | 'product_card' | 'done';
        chunk?: string;
        data?: any;
        done: boolean;
      }) => {
        if (data.done || data.type === 'done') {
          const textToSave = streamingTextRef.current;
          if (textToSave) {
            setMessages((msgs) => [
              ...msgs,
              {
                role: 'assistant',
                content: textToSave,
                timestamp: Date.now(),
                type: 'text',
              },
            ]);
          }
          setCurrentStreamingMessage('');
          streamingTextRef.current = '';
          setShowStreamingMessage(true);
          setIsStreaming(false);
        } else if (data.type === 'text' && data.chunk) {
          // Accumulate text and show it
          streamingTextRef.current += data.chunk;
          setCurrentStreamingMessage(streamingTextRef.current);
          setShowStreamingMessage(true);
        } else if (data.type === 'product_card' && data.data) {
          // Save text before card
          const textToSave = streamingTextRef.current;
          if (textToSave) {
            setMessages((msgs) => [
              ...msgs,
              {
                role: 'assistant',
                content: textToSave,
                timestamp: Date.now(),
                type: 'text',
              },
            ]);
          }
          setCurrentStreamingMessage('');
          streamingTextRef.current = '';
          setShowStreamingMessage(false); // Don't show in return

          // Add product card
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: '',
              timestamp: Date.now(),
              type: 'product_card',
              productCard: data.data,
            },
          ]);
        }
      }
    );

    socket.on('chat:error', (data: { sessionId: string; error: string }) => {
      setError(data.error);
      setIsStreaming(false);
      setCurrentStreamingMessage('');
      streamingTextRef.current = '';
    });

    socket.on('chat:aborted', () => {
      setIsStreaming(false);
      setCurrentStreamingMessage('');
      streamingTextRef.current = '';
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Failed to connect to chat server');
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [serverUrl, autoConnect]);

  const sendMessage = useCallback(
    (message: string) => {
      if (!socketRef.current || !isConnected) {
        setError('Not connected to chat server');
        return;
      }

      if (isStreaming) {
        setError('Please wait for the current message to complete');
        return;
      }

      setError(null);
      setIsStreaming(true);

      // Add user message to chat
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Send to server
      socketRef.current.emit('chat:query', {
        query: message,
        sessionId: sessionIdRef.current,
        messages: messages,
      });
    },
    [isConnected, isStreaming, messages]
  );

  const abortStream = useCallback(() => {
    if (socketRef.current && isStreaming) {
      socketRef.current.emit('chat:abort', {
        sessionId: sessionIdRef.current,
      });
      setIsStreaming(false);
      setCurrentStreamingMessage('');
    }
  }, [isStreaming]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentStreamingMessage('');
    streamingTextRef.current = '';
    setShowStreamingMessage(true);
    setError(null);
  }, []);

  return {
    messages:
      currentStreamingMessage && showStreamingMessage
        ? [
            ...messages,
            {
              role: 'assistant',
              content: currentStreamingMessage,
              timestamp: Date.now(),
              type: 'text' as const,
            },
          ]
        : messages,
    isConnected,
    isStreaming,
    sendMessage,
    abortStream,
    clearMessages,
    error,
  };
}
