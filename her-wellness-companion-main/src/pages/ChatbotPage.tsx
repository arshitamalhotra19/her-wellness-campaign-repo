import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getChatbotResponse } from '@/lib/chatbot-data';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', text: "Hello! 💕 I'm your DetectHer health assistant. Ask me anything about cervical health, HPV, symptoms, prevention, and more. I'm here for you! 🌸", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: input.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const response = getChatbotResponse(userMsg.text);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: response, sender: 'bot' }]);
    }, 600);
  };

  const quickTopics = ['What is HPV?', 'Symptoms of cervical cancer', 'How to prevent it?', 'When to get screened?'];

  return (
    <div className="max-w-2xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      <h1 className="text-2xl font-heading font-bold text-foreground mb-1">AI Health Assistant</h1>
      <p className="text-sm text-muted-foreground mb-4">Ask me anything about cervical health 💕</p>

      {/* Quick Topics */}
      <div className="flex gap-2 flex-wrap mb-4">
        {quickTopics.map(topic => (
          <button
            key={topic}
            onClick={() => { setInput(topic); }}
            className="text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
              msg.sender === 'user'
                ? 'gradient-primary text-primary-foreground rounded-br-md'
                : 'glass-card rounded-bl-md'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Type your question..."
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="gradient-primary text-primary-foreground rounded-xl px-4 disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
