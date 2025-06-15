'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  PaperAirplaneIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import clsx from 'clsx';
import {
  GlassCard,
  GlassCardHeader,
  GlassCardBody,
  GlassCardFooter,
} from '@/components/ui/glass-card';
import { Button } from '@/components/button';
import {
  createChatSession,
  sendMessage,
  clearChatSession,
  exportChatHistory,
  type ChatSession,
  type Message as CCMessage,
} from '@/lib/command-center';

export type CalmMessage = CCMessage;

interface CalmCommandCenterProps {
  initialMessages?: CalmMessage[];
  onSendMessage?: (message: string) => void;
}

export function CalmCommandCenter({
  initialMessages = [],
  onSendMessage,
}: CalmCommandCenterProps) {
  const [messages, setMessages] = useState<CalmMessage[]>(initialMessages);
  const [text, setText] = useState('');
  const [session, setSession] = useState<ChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!session) {
      setSession(createChatSession('demo-user', { model: 'gpt-4' }));
    }
  }, [session]);

  const handleClear = () => {
    if (session) {
      clearChatSession(session.id);
      setSession(createChatSession('demo-user', { model: session.config.model }));
    }
    setMessages([]);
  };

  const handleExport = () => {
    if (!session) return;
    const data = exportChatHistory(session.id, 'json');
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-history.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSend = async () => {
    if (!text.trim() || !session) return;
    const userMsg: CCMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setText('');
    onSendMessage?.(text.trim());

    const assistantId = `${userMsg.id}-a`;
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    for await (const token of sendMessage(session.id, userMsg)) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: m.content + token } : m
        )
      );
    }
  };

  const renderMessage = (msg: CalmMessage) => {
    const isUser = msg.role === 'user';
    const bubbleClasses = clsx(
      'px-3 py-2 rounded-lg max-w-xs break-words',
      isUser
        ? 'bg-ai-blue text-white self-end'
        : 'bg-zinc-800/70 text-zinc-200'
    );

    return (
      <div key={msg.id} className={clsx('flex mb-2', isUser ? 'justify-end' : 'justify-start')}>
        <div className={bubbleClasses}>{msg.content}</div>
      </div>
    );
  };

  return (
    <GlassCard className="h-full flex flex-col">
      <GlassCardHeader className="border-b border-zinc-800/20 flex items-center justify-between">
        <h2 className="font-medium text-zinc-200">Calm Command Center</h2>
        <div className="flex gap-1">
          <Button plain onClick={handleExport} aria-label="Export chat">
            <ArrowDownTrayIcon className="w-4 h-4" />
          </Button>
          <Button plain onClick={handleClear} aria-label="Clear chat">
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      </GlassCardHeader>
      <GlassCardBody className="flex-1 overflow-y-auto styled-scrollbar-dark space-y-1 p-4">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </GlassCardBody>
      <GlassCardFooter className="border-t border-zinc-800/20">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 bg-zinc-800/50 text-zinc-200 placeholder-zinc-500 rounded-lg px-3 py-2 focus:outline-none"
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            className="bg-ai-blue text-white px-3 py-2 flex items-center gap-1"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </GlassCardFooter>
    </GlassCard>
  );
}
