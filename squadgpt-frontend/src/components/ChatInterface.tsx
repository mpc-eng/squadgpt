'use client';

import { useState, useRef, useEffect } from 'react';
import { usePRD } from '../contexts/PRDContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Agent avatar component with color-coded initials
const AgentAvatar = () => (
  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
    AI
  </div>
);

// User avatar component
const UserAvatar = () => (
  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-sm font-medium">
    U
  </div>
);

// Typing indicator with animated dots
const TypingIndicator = () => (
  <div className="flex items-center space-x-1">
    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
  </div>
);

export const ChatInterface = () => {
  const { stage, sections, title } = usePRD();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatPRDContext = () => {
    const contextParts = [];
    
    if (title) {
      contextParts.push(`Project Title: ${title}`);
    }
    
    if (sections.problemStatement) {
      contextParts.push(`Problem Statement: ${sections.problemStatement}`);
    }
    
    if (sections.successMetrics.length > 0) {
      contextParts.push(`Success Metrics: ${sections.successMetrics.join(', ')}`);
    }
    
    if (sections.tradeOffs.length > 0) {
      contextParts.push(`Trade-offs: ${sections.tradeOffs.join(', ')}`);
    }
    
    if (sections.learnings) {
      contextParts.push(`Learnings: ${sections.learnings}`);
    }
    
    return contextParts.join('\n');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const prdContext = formatPRDContext();
      const systemPrompt = `You are responding in the ${stage} stage of the PRD. Use this context: ${prdContext}`;

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          stage,
          prdContext: prdContext || 'No PRD context available yet.',
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered a network error. Please check your connection and try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-md border h-[600px] flex flex-col">
      {/* Header with PRD Stage */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">AI Assistant</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">📍 Current PRD Stage:</span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
              {stage}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-lg font-medium mb-2">Start a conversation</p>
            <p className="text-sm">Ask me anything about your project in the {stage} stage!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              {message.role === 'user' ? <UserAvatar /> : <AgentAvatar />}
              
              {/* Message Bubble */}
              <div
                className={`rounded-xl p-3 max-w-[75%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-muted text-muted-foreground mr-auto'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                <div
                  className={`text-xs mt-2 opacity-70 ${
                    message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <AgentAvatar />
            <div className="bg-muted text-muted-foreground rounded-xl p-3 max-w-[75%] mr-auto">
              <div className="flex items-center gap-2">
                <TypingIndicator />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex gap-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask me about your project in the ${stage} stage...`}
            className="flex-1 border rounded-md px-4 py-2 focus:outline-none w-full bg-background text-foreground resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}; 