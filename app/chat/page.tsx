'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { getAIResponse } from '@/lib/chatService';
import MessageBubble from '@/components/MessageBubble';
import TypingIndicator from '@/components/TypingIndicator';
import QuickActions from '@/components/QuickActions';

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: "👋 Hello! I'm your AI education assistant powered by Google Gemini. I'm here to help you with:\n\n• Explaining complex concepts\n• Solving homework problems step-by-step\n• Answering questions on any subject\n• Creating study guides and summaries\n\nWhat would you like to learn about today?",
            sender: 'ai',
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await getAIResponse(input);

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: response.message,
                sender: 'ai',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error getting AI response:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: 'I apologize, but I encountered an error. Please try again.',
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleQuickAction = (message: string) => {
        setInput(message);
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 px-4 pb-8">
            <div className="w-full max-w-4xl">
                {/* Chat Container */}
                <div className="glass-card h-[80vh] flex flex-col overflow-hidden p-0">
                    {/* Chat Header */}
                    <div className="gradient-primary p-6 text-center">
                        <h2 className="text-2xl font-bold text-white mb-1">💬 AI Education Assistant</h2>
                        <p className="text-white/90 text-sm">Powered by Google Gemini</p>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                        {messages.map(message => (
                            <MessageBubble key={message.id} message={message} />
                        ))}
                        {isLoading && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10 bg-slate-800/50">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your question here..."
                                className="flex-1 px-4 py-3 glass border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <QuickActions onActionClick={handleQuickAction} />
            </div>
        </div>
    );
}
