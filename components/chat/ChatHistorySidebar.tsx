'use client';

import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';

export interface ChatHistory {
    id: string;
    title: string;
    category: 'Math' | 'Science' | 'Languages' | 'History' | 'Others';
    messages: any[];
    createdAt: number;
    updatedAt: number;
}

interface ChatHistorySidebarProps {
    chats: ChatHistory[];
    currentChatId: string | null;
    onSelectChat: (chatId: string) => void;
    onNewChat: () => void;
    onDeleteChat: (chatId: string) => void;
}

const categoryIcons: Record<string, string> = {
    Math: '🧮',
    Science: '🔬',
    Languages: '📚',
    History: '📜',
    Others: '📝'
};

export default function ChatHistorySidebar({
    chats,
    currentChatId,
    onSelectChat,
    onNewChat,
    onDeleteChat
}: ChatHistorySidebarProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set(['Math', 'Science', 'Languages', 'History', 'Others'])
    );
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    // Group chats by category
    const groupedChats = chats.reduce((acc, chat) => {
        if (!acc[chat.category]) {
            acc[chat.category] = [];
        }
        acc[chat.category].push(chat);
        return acc;
    }, {} as Record<string, ChatHistory[]>);

    // Sort chats within each category by updatedAt (newest first)
    Object.keys(groupedChats).forEach(category => {
        groupedChats[category].sort((a, b) => b.updatedAt - a.updatedAt);
    });

    const categories = ['Math', 'Science', 'Languages', 'History', 'Others'];

    return (
        <div className="h-full flex flex-col bg-slate-900/50 border-r border-white/10">
            {/* Header */}
            <div className="p-3 pt-6 border-b border-white/10">
                <button
                    onClick={onNewChat}
                    className="w-full gradient-primary text-white px-4 py-3 rounded-xl font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Chat
                </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {categories.map(category => {
                    const categoryChats = groupedChats[category] || [];
                    if (categoryChats.length === 0) return null;

                    return (
                        <div key={category} className="border-b border-white/5">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(category)}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{categoryIcons[category]}</span>
                                    <span className="text-white font-semibold">{category}</span>
                                    <span className="text-xs text-gray-400">({categoryChats.length})</span>
                                </div>
                                <svg
                                    className={`w-4 h-4 text-gray-400 transition-transform ${expandedCategories.has(category) ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Chat List */}
                            {expandedCategories.has(category) && (
                                <div className="pb-2">
                                    {categoryChats.map(chat => (
                                        <div
                                            key={chat.id}
                                            className={`group relative px-4 py-2 mx-2 rounded-lg cursor-pointer transition-all ${currentChatId === chat.id
                                                ? 'bg-purple-500/20 border border-purple-400/50'
                                                : 'hover:bg-white/5'
                                                }`}
                                            onClick={() => onSelectChat(chat.id)}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-sm text-white truncate flex-1">{chat.title}</p>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('Are you sure you want to delete this chat?')) {
                                                            onDeleteChat(chat.id);
                                                        }
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {mounted ? new Date(chat.updatedAt).toLocaleDateString() : ''}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {chats.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                        <p className="text-sm">No chat history yet.</p>
                        <p className="text-xs mt-2">Start a new conversation!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
