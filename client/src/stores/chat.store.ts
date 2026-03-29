// src/stores/chat.store.ts
import { create } from 'zustand';
import { ChatMessage, ChatStatus } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

interface ChatState {
  messages: ChatMessage[];
  status: ChatStatus;
  sessionId: string | null;
  error: string | null;
  streamingMsgId: string | null;

  setStatus: (status: ChatStatus) => void;
  setSessionId: (id: string) => void;
  setError: (error: string | null) => void;
  addUserMessage: (content: string) => void;
  startAssistantMessage: () => string;
  appendChunk: (msgId: string, chunk: string) => void;
  setToolActivity: (msgId: string, activity: string | undefined) => void;
  finalizeMessage: (msgId: string, opts?: { wasStopped?: boolean }) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  status: 'idle',
  sessionId: null,
  error: null,
  streamingMsgId: null,

  setStatus: (status) => set({ status }),
  setSessionId: (id) => set({ sessionId: id }),
  setError: (error) => set({ error }),

  addUserMessage: (content) => {
    const msg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      createdAt: new Date(),
    };
    set((s) => ({ messages: [...s.messages, msg] }));
  },

  startAssistantMessage: () => {
    const id = uuidv4();
    const msg: ChatMessage = {
      id,
      role: 'assistant',
      content: '',
      isStreaming: true,
      createdAt: new Date(),
    };
    set((s) => ({ messages: [...s.messages, msg], streamingMsgId: id }));
    return id;
  },

  appendChunk: (msgId, chunk) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === msgId ? { ...m, content: m.content + chunk } : m
      ),
    })),

  setToolActivity: (msgId, activity) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === msgId ? { ...m, toolActivity: activity } : m
      ),
    })),

  finalizeMessage: (msgId, opts = {}) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === msgId
          ? {
              ...m,
              isStreaming: false,
              wasStopped: opts.wasStopped,
              toolActivity: undefined,
            }
          : m
      ),
      streamingMsgId: null,
    })),

  reset: () =>
    set({
      messages: [],
      status: 'idle',
      sessionId: null,
      error: null,
      streamingMsgId: null,
    }),
}));
