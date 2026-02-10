"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/game_dungeon/dungeon_store';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export const DungeonChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const { chatMessages, submitChatMessage } = useGameStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const msg = input.trim();
        setInput('');
        await submitChatMessage(msg);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-80 md:w-96 h-[450px] bg-slate-800 border-2 border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-slate-700 border-b border-slate-600 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-white font-bold">
                                <Bot size={20} className="text-orange-500" />
                                <span>AI Sifu Discussion</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-600">
                            {chatMessages.length === 0 ? (
                                <div className="text-center text-slate-500 mt-10">
                                    <MessageSquare size={40} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">Need help understanding the topic?</p>
                                    <p className="text-xs">Ask AI Sifu anything!</p>
                                </div>
                            ) : (
                                chatMessages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-orange-600 text-white rounded-tr-none'
                                            : 'bg-slate-700 text-slate-200 rounded-tl-none'
                                            }`}>
                                            <ReactMarkdown
                                                className="prose prose-invert prose-sm max-w-none break-words"
                                                remarkPlugins={[remarkGfm, remarkMath]}
                                                rehypePlugins={[rehypeKatex]}
                                                components={{
                                                    p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                                                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                                                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                                                    li: ({ children }) => <li>{children}</li>,
                                                    code: ({ className, children, ...props }: any) => {
                                                        const match = /language-(\w+)/.exec(className || '');
                                                        const isInline = !match && !children?.toString().includes('\n');
                                                        return isInline ? (
                                                            <code className="bg-black/20 rounded px-1 py-0.5 text-xs font-mono" {...props}>
                                                                {children}
                                                            </code>
                                                        ) : (
                                                            <div className="bg-black/30 rounded-lg p-2 my-2 overflow-x-auto">
                                                                <code className={`${className} text-xs font-mono`} {...props}>
                                                                    {children}
                                                                </code>
                                                            </div>
                                                        );
                                                    },
                                                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-1">{children}</h1>,
                                                    h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-1">{children}</h2>,
                                                    h3: ({ children }) => <h3 className="text-sm font-bold mb-1 mt-1">{children}</h3>,
                                                    blockquote: ({ children }) => <blockquote className="border-l-2 border-white/30 pl-3 italic my-2 text-white/80">{children}</blockquote>,
                                                    a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">{children}</a>,
                                                    table: ({ children }) => <div className="overflow-x-auto my-2"><table className="min-w-full border-collapse border border-white/20 text-xs">{children}</table></div>,
                                                    th: ({ children }) => <th className="border border-white/20 px-2 py-1 bg-white/10">{children}</th>,
                                                    td: ({ children }) => <td className="border border-white/20 px-2 py-1">{children}</td>,
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Discuss the topic..."
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button
                                onClick={handleSend}
                                className="bg-orange-600 hover:bg-orange-500 text-white p-2 rounded-xl transition-colors shadow-lg"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-orange-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center border-4 border-slate-900"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>
        </div>
    );
};
