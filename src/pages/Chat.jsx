import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Send, Bot, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './Chat.css';

const SUGGESTIONS = [
  "How do I register to vote?",
  "What documents are needed?",
  "How does voting work?"
];

export const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Hi! I'm your Election Education Assistant. I can help you understand the voting process in simple steps. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { getAuthHeader } = useAuth();

  const handleSend = async (e, textInput) => {
    if (e) e.preventDefault();
    const finalInput = textInput || input;
    if (!finalInput.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: finalInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ message: finalInput })
      });
      const data = await res.json();
      
      const botMsg = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: data.reply || "Sorry, I couldn't process that."
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now()+1, sender: 'bot', text: 'Error connecting to VoteBot server.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestion = (text) => {
    handleSend(null, text);
  };

  return (
    <div className="chat-page flex flex-col h-full relative bg-surface">
      <div className="chat-header p-4 border-b-2 border-border flex items-center justify-center gap-2 sticky top-[var(--header-height)] bg-surface z-10 shadow-sm">
        <span className="text-3xl bounce-animation">🗳️</span>
        <h2 className="font-extrabold text-lg m-0 text-primary">VoteBot</h2>
      </div>

      <div className="chat-messages flex-1 overflow-y-auto p-4 pb-32 bg-background/50">
        {messages.map(msg => (
          <div key={msg.id} className={`message-wrapper flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-2 flex-shrink-0 border-b-2 border-primary-shadow self-end mb-1">
                <Bot size={18} />
              </div>
            )}
            <div className={`message-bubble p-3 px-4 rounded-2xl max-w-[80%] font-bold text-sm animate-pop ${
              msg.sender === 'user' ? 'bg-secondary text-white rounded-br-sm border-b-4 border-secondary-shadow' : 'bg-surface text-text-main rounded-bl-sm border-2 border-b-4 border-border'
            }`}>
              {msg.text}
            </div>
            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white ml-2 flex-shrink-0 border-b-2 border-secondary-shadow self-end mb-1">
                <User size={18} />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="message-wrapper flex mb-4 justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-2 flex-shrink-0 border-b-2 border-primary-shadow self-end mb-1">
              <Bot size={18} />
            </div>
            <div className="message-bubble p-3 px-4 rounded-2xl bg-surface border-2 border-b-4 border-border rounded-bl-sm flex items-center gap-1">
              <div className="typing-dot"></div>
              <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
              <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-area fixed bottom-[var(--nav-height)] left-0 right-0 bg-surface p-3 px-4 border-t-2 border-border z-10 mx-auto max-w-[var(--max-width)] shadow-lg">
        <div className="suggestions flex gap-2 overflow-x-auto pb-3 pt-1 mb-1 no-scrollbar">
          {SUGGESTIONS.map((text, i) => (
            <button 
              key={i} 
              className="suggestion-chip whitespace-nowrap bg-surface border-2 border-b-4 border-border rounded-full px-4 py-2 text-sm text-secondary font-bold hover:bg-secondary/10 transition-all active:border-b-2 active:translate-y-1"
              onClick={() => handleSuggestion(text)}
            >
              {text}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => handleSend(e, null)} className="flex gap-2 items-center">
          <input 
            type="text" 
            className="chat-input flex-1 p-3 px-4 font-bold rounded-full border-2 border-border bg-background focus:border-secondary focus:outline-none transition-colors"
            placeholder="Ask VoteBot a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center border-b-4 border-primary-shadow active:border-b-0 active:translate-y-1 transition-all"
            disabled={!input.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
