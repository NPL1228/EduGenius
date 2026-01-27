'use client';

import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';

export interface ChatHistory {
    id: string;
    title: string;
    category: string;
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
    categories: string[];
    onAddCategory: (name: string) => void;
    onRenameCategory: (oldName: string, newName: string) => void;
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
    onDeleteChat,
    onRenameChat,
    onChangeCategory,
    categories,
    onAddCategory,
    onRenameCategory
}: ChatHistorySidebarProps & {
    onRenameChat: (chatId: string, newTitle: string) => void;
    onChangeCategory: (chatId: string, newCategory: string) => void;
}) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set(categories)
    );
    const [mounted, setMounted] = useState(false);

    // UI States
    const [editingChatId, setEditingChatId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [menuOpenChatId, setMenuOpenChatId] = useState<string | null>(null);
    const [categorySelectorChatId, setCategorySelectorChatId] = useState<string | null>(null);

    // Category Editing States
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('bottom');

    useEffect(() => {
        setMounted(true);
        // Sync expanded state with new categories if needed, or just default all open
        setExpandedCategories(new Set(categories));

        const handleClickOutside = () => {
            setMenuOpenChatId(null);
            setCategorySelectorChatId(null);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [categories.length]); // Re-run when categories change

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    const startEditing = (chat: ChatHistory, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingChatId(chat.id);
        setEditTitle(chat.title);
        setMenuOpenChatId(null);
    };

    const saveEdit = () => {
        if (editingChatId && editTitle.trim()) {
            onRenameChat(editingChatId, editTitle.trim());
        }
        setEditingChatId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') saveEdit();
        if (e.key === 'Escape') setEditingChatId(null);
    };

    // Category Management Handlers
    const saveNewCategory = () => {
        if (newCategoryName.trim()) {
            onAddCategory(newCategoryName.trim());
            setNewCategoryName('');
            setIsAddingCategory(false);
        }
    };

    const startEditingCategory = (category: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingCategory(category);
        setEditCategoryName(category);
    };

    const saveCategoryEdit = () => {
        if (editingCategory && editCategoryName.trim() && editCategoryName !== editingCategory) {
            onRenameCategory(editingCategory, editCategoryName.trim());
        }
        setEditingCategory(null);
    };

    // Group chats by category
    const groupedChats = chats.reduce((acc, chat) => {
        const cat = categories.includes(chat.category) ? chat.category : 'Others';
        if (!acc[cat]) {
            acc[cat] = [];
        }
        acc[cat].push(chat);
        return acc;
    }, {} as Record<string, ChatHistory[]>);

    // Sort chats within each category by updatedAt (newest first)
    Object.keys(groupedChats).forEach(category => {
        groupedChats[category].sort((a, b) => b.updatedAt - a.updatedAt);
    });

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
                    const isEditing = editingCategory === category;

                    return (
                        <div key={category} className="border-b border-white/5 group/cat">
                            {/* Category Header */}
                            <div className="flex items-center w-full hover:bg-white/5 transition-colors pr-2">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editCategoryName}
                                        onChange={(e) => setEditCategoryName(e.target.value)}
                                        onBlur={saveCategoryEdit}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') saveCategoryEdit();
                                            if (e.key === 'Escape') setEditingCategory(null);
                                        }}
                                        autoFocus
                                        className="flex-1 bg-slate-800 text-white text-sm px-4 py-3 m-1 rounded border border-purple-500 focus:outline-none"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <>
                                        <button
                                            onClick={() => toggleCategory(category)}
                                            className="flex-1 px-4 py-3 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{categoryIcons[category] || '📁'}</span>
                                                <span className="text-white font-semibold">{category}</span>
                                                <span className="text-xs text-gray-400">({categoryChats.length})</span>
                                            </div>
                                        </button>

                                        {/* Edit Category Button */}
                                        <button
                                            onClick={(e) => startEditingCategory(category, e)}
                                            className="opacity-0 group-hover/cat:opacity-100 p-1 text-gray-400 hover:text-white transition-opacity"
                                            title="Rename Category"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={() => toggleCategory(category)}
                                            className="p-2 text-gray-400"
                                        >
                                            <svg
                                                className={`w-4 h-4 transition-transform ${expandedCategories.has(category) ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>

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
                                            {editingChatId === chat.id ? (
                                                <input
                                                    type="text"
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    onBlur={saveEdit}
                                                    onKeyDown={handleKeyDown}
                                                    autoFocus
                                                    className="w-full bg-slate-800 text-white text-sm px-2 py-1 rounded border border-purple-500 focus:outline-none"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm text-white truncate flex-1">{chat.title}</p>

                                                    {/* Menu Trigger */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.nativeEvent.stopImmediatePropagation();

                                                            // Calculate position
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            const spaceBelow = window.innerHeight - rect.bottom;
                                                            setMenuPosition(spaceBelow < 200 ? 'top' : 'bottom'); // 200px threshold

                                                            setMenuOpenChatId(menuOpenChatId === chat.id ? null : chat.id);
                                                            setCategorySelectorChatId(null);
                                                        }}
                                                        className={`opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all p-1 rounded hover:bg-white/10 ${menuOpenChatId === chat.id ? 'opacity-100' : ''}`}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                        </svg>
                                                    </button>

                                                    {/* Context Menu */}
                                                    {menuOpenChatId === chat.id && (
                                                        <div className={`absolute right-0 z-50 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 ${menuPosition === 'top'
                                                            ? 'bottom-8 origin-bottom-right'
                                                            : 'top-8 origin-top-right'
                                                            }`}>
                                                            <button
                                                                onClick={(e) => startEditing(chat, e)}
                                                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-2"
                                                            >
                                                                <span>✏️</span> Rename
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    e.nativeEvent.stopImmediatePropagation();
                                                                    setCategorySelectorChatId(chat.id);
                                                                    setMenuOpenChatId(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-2"
                                                            >
                                                                <span>📂</span> Move to...
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (window.confirm('Are you sure you want to delete this chat?')) {
                                                                        onDeleteChat(chat.id);
                                                                    }
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                                                            >
                                                                <span>🗑️</span> Delete
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Category Selector Submenu Overlay */}
                                                    {categorySelectorChatId === chat.id && (
                                                        <div className="absolute left-0 top-full mt-2 z-50 w-full bg-slate-900 border border-white/10 rounded-xl shadow-xl p-2 animate-in fade-in zoom-in duration-200">
                                                            <p className="text-xs text-gray-500 mb-2 px-2">Select Category:</p>
                                                            {categories.map(cat => (
                                                                <button
                                                                    key={cat}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        e.nativeEvent.stopImmediatePropagation();
                                                                        onChangeCategory(chat.id, cat);
                                                                        setCategorySelectorChatId(null);
                                                                    }}
                                                                    className={`w-full text-left px-2 py-1.5 rounded text-sm mb-1 ${chat.category === cat
                                                                        ? 'bg-purple-500/20 text-purple-300'
                                                                        : 'text-gray-300 hover:bg-white/10'
                                                                        }`}
                                                                >
                                                                    <span className="mr-2">{categoryIcons[cat] || '📁'}</span>
                                                                    {cat}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

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

                {/* Add Category Section */}
                <div className="p-3 border-t border-white/10 mt-auto">
                    {isAddingCategory ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveNewCategory();
                                    if (e.key === 'Escape') setIsAddingCategory(false);
                                }}
                                autoFocus
                                placeholder="Category name..."
                                className="flex-1 bg-slate-800 text-white text-sm px-2 py-1.5 rounded border border-purple-500 focus:outline-none"
                            />
                            <button onClick={saveNewCategory} className="text-green-400 hover:text-green-300">✅</button>
                            <button onClick={() => setIsAddingCategory(false)} className="text-red-400 hover:text-red-300">❌</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAddingCategory(true)}
                            className="w-full py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg border border-dashed border-gray-600 hover:border-gray-400 transition-all"
                        >
                            + New Category
                        </button>
                    )}
                </div>

                {chats.length === 0 && !isAddingCategory && (
                    <div className="p-8 text-center text-gray-400">
                        <p className="text-sm">No chat history yet.</p>
                        <p className="text-xs mt-2">Start a new conversation!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
