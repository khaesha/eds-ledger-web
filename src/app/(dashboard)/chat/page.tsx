'use client';

import { useEffect, useRef, useState } from 'react';
import { chatApi } from '@/lib/api';
import { type ChatMessage } from '@/types';
import EddaAvatar from '@/components/edward/EdwardAvatar';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hey! I'm Edda, your AI financial advisor. Ask me anything about your spending habits or how to save more!",
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const send = async () => {
    const text = input.trim();
    if (!text || thinking) return;
    const userMessage: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setThinking(true);
    try {
      const res = await chatApi.ask(text);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I couldn't respond right now. Try again." },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="px-8 py-4 border-b border-gray-800 flex items-center gap-3">
        <EddaAvatar />
        <div>
          <p className="font-semibold">Edda</p>
          <p className="text-xs text-gray-400">AI Financial Advisor</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'assistant' && <EddaAvatar />}
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-sm'
                  : 'bg-edward-navy2 text-white rounded-tl-sm border-l-4 border-edward-amber'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex items-start gap-3">
            <EddaAvatar thinking />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-8 py-4 border-t border-gray-800">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask Edda about your finances..."
            rows={1}
            maxLength={2000}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm resize-none focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={send}
            disabled={thinking || !input.trim()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-1">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}
