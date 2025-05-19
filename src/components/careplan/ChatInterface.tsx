import React, { useState } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  context?: any;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  isGenerating?: boolean;
  placeholderText?: string;
  userName?: string;
  assistantName?: string;
  isCarePlanMode?: boolean;
  predefinedPrompts?: string[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isGenerating = false, placeholderText = 'Type a message', predefinedPrompts = [] }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText('');
  };

  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 space-y-3">
      <div className="h-64 overflow-y-auto styled-scrollbar-dark p-2 bg-slate-950 rounded">
        {messages.map(m => (
          <div key={m.id} className="mb-2 text-sm text-slate-200">
            <strong>{m.role === 'user' ? 'You' : 'Ron AI'}:</strong> {m.content}
          </div>
        ))}
      </div>
      {predefinedPrompts.length > 0 && (
        <div className="space-x-2">
          {predefinedPrompts.map(p => (
            <button key={p} className="text-xs bg-slate-800 px-2 py-1 rounded" onClick={() => { setText(p); }}>
              {p}
            </button>
          ))}
        </div>
      )}
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 bg-slate-800 text-slate-200 p-2 rounded"
          value={text}
          placeholder={placeholderText}
          onChange={e => setText(e.target.value)}
        />
        <button onClick={handleSend} disabled={isGenerating} className="bg-sky-600 text-white px-3 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
