'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import MessageBubble from '@/components/MessageBubble';
import TypingIndicator from '@/components/TypingIndicator';
import ImageUploader from '@/components/chat/ImageUploader';
import VoiceInput from '@/components/chat/VoiceInput';
import ChatHeader from '@/components/ChatHeader';
import ChatHistorySidebar, { ChatHistory } from '@/components/chat/ChatHistorySidebar';

const CHAT_HISTORY_KEY = 'chatHistory';
const WELCOME_MESSAGE: Message = {
    id: 'welcome',
    content: "👋 Hello! I'm your AI education assistant powered by Google Gemini with vision capabilities. I can help you with:\n\n• 📸 **Visual Problem Solving** - Upload images of handwritten questions, equations, or diagrams\n\n• 📝 **Step-by-step Explanations** - Get detailed breakdowns of complex concepts\n\n• 🎤 **Voice Input** - Ask questions using your voice\n\n• 💬 **Text Chat** - Type your questions directly\n\n• 🎓 **Any Subject** - Math, Science, History, Languages, and more\n\nHow can I help you learn today?",
    sender: 'ai',
    timestamp: new Date(0),
};

export default function ChatPage() {
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<{
        data: string;
        mimeType: string;
        url: string;
    } | null>(null);

    // Load chat history from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(CHAT_HISTORY_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Normalize dates from strings back to Date objects
                const normalized = parsed.map((chat: any) => ({
                    ...chat,
                    messages: chat.messages.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }))
                }));
                setChatHistory(normalized);
            } catch (e) {
                console.error('Failed to parse chat history', e);
            }
        }
    }, []);

    // Save chat history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
    }, [chatHistory]);

    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        const container = messagesContainerRef.current;
        if (!container) return;
        container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);


    // Save current chat to history
    const saveCurrentChat = async (updatedMessages: Message[], chatIdParam?: string, category?: string) => {
        const targetChatId = chatIdParam || currentChatId;
        if (!targetChatId || updatedMessages.length <= 1) return;

        const userMessages = updatedMessages.filter(m => m.sender === 'user');
        if (userMessages.length === 0) return;

        let chatCategory = category;

        // If no category provided, categorize using AI (only for first user message)
        if (!category && userMessages.length === 1) {
            try {
                const response = await fetch('/api/gemini/categorize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userMessages[0].content })
                });
                const data = await response.json();
                chatCategory = data.category;
            } catch (error) {
                console.error('Failed to categorize chat', error);
                chatCategory = 'Others';
            }
        }

        const title = userMessages[0].content.substring(0, 50) + (userMessages[0].content.length > 50 ? '...' : '');
        const now = Date.now();

        setChatHistory(prev => {
            const existingIndex = prev.findIndex(chat => chat.id === targetChatId);
            const updatedChat: ChatHistory = {
                id: targetChatId as string,
                title,
                category: (chatCategory as any) || prev[existingIndex]?.category || 'Others',
                messages: updatedMessages,
                createdAt: prev[existingIndex]?.createdAt || now,
                updatedAt: now
            };

            if (existingIndex >= 0) {
                const newHistory = [...prev];
                newHistory[existingIndex] = updatedChat;
                return newHistory;
            } else {
                return [...prev, updatedChat];
            }
        });
    };

    const handleImageSelect = (imageData: string, mimeType: string, imageUrl: string) => {
        setSelectedImage({ data: imageData, mimeType, url: imageUrl });
    };

    const handleClearImage = () => {
        if (selectedImage?.url) {
            URL.revokeObjectURL(selectedImage.url);
        }
        setSelectedImage(null);
    };

    const handleVoiceTranscript = (transcript: string) => {
        setInput(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    const handleSend = async () => {
        if ((!input.trim() && !selectedImage) || isLoading) return;

        let activeChatId = currentChatId;

        // Create new chat if needed
        if (!activeChatId) {
            activeChatId = `chat_${Date.now()}`;
            setCurrentChatId(activeChatId);
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input || '(Image question)',
            sender: 'user',
            timestamp: new Date(),
            imageUrl: selectedImage?.url,
            imageData: selectedImage?.data,
            mimeType: selectedImage?.mimeType,
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        const imageToSend = selectedImage;
        setSelectedImage(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/gemini/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    image: imageToSend?.data,
                    mimeType: imageToSend?.mimeType,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: data.message,
                sender: 'ai',
                timestamp: new Date(),
            };

            const finalMessages = [...updatedMessages, aiMessage];
            setMessages(finalMessages);

            // Save chat after AI response
            if (activeChatId) {
                await saveCurrentChat(finalMessages, activeChatId);
            }
        } catch (error) {
            console.error('Error getting AI response:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: 'I apologize, but I encountered an error. Please try again.',
                sender: 'ai',
                timestamp: new Date(),
            };
            const finalMessages = [...updatedMessages, errorMessage];
            setMessages(finalMessages);
            if (activeChatId) {
                await saveCurrentChat(finalMessages, activeChatId);
            }
        } finally {
            setIsLoading(false);
            if (imageToSend?.url && !messages.find(m => m.imageUrl === imageToSend.url)) {
                URL.revokeObjectURL(imageToSend.url);
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleNewChat = () => {
        setCurrentChatId(null);
        setMessages([WELCOME_MESSAGE]);
        setInput('');
        setSelectedImage(null);
    };

    const handleSelectChat = (chatId: string) => {
        const chat = chatHistory.find(c => c.id === chatId);
        if (chat) {
            setCurrentChatId(chatId);
            setMessages(chat.messages);
            setInput('');
            setSelectedImage(null);
        }
    };

    const handleDeleteChat = (chatId: string) => {
        setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
        if (currentChatId === chatId) {
            handleNewChat();
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Custom Chat Header */}
            <ChatHeader />

            {/* Main Content: Sidebar + Chat */}
            <div className="flex-1 flex overflow-hidden pt-16">
                {/* Sidebar */}
                <div className="w-64 flex-shrink-0">
                    <ChatHistorySidebar
                        chats={chatHistory}
                        currentChatId={currentChatId}
                        onSelectChat={handleSelectChat}
                        onNewChat={handleNewChat}
                        onDeleteChat={handleDeleteChat}
                    />
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Messages Area */}
                    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-4">
                        {messages.map(message => (
                            <MessageBubble key={message.id} message={message} />
                        ))}
                        {isLoading && <TypingIndicator />}
                    </div>

                    {/* Input Area */}
                    <div className="px-4 md:px-8 py-4 border-t border-white/10 bg-slate-900/80 backdrop-blur-sm">
                        {/* Image Preview */}
                        {selectedImage && (
                            <div className="mb-3 max-w-5xl mx-auto">
                                <ImageUploader
                                    onImageSelect={handleImageSelect}
                                    selectedImageUrl={selectedImage.url}
                                    onClearImage={handleClearImage}
                                />
                            </div>
                        )}

                        {/* Input Controls */}
                        <div className="flex gap-3 items-end max-w-5xl mx-auto">
                            {/* Image Upload & Voice Input */}
                            <div className="flex gap-2">
                                {!selectedImage && (
                                    <ImageUploader
                                        onImageSelect={handleImageSelect}
                                        selectedImageUrl={null}
                                        onClearImage={handleClearImage}
                                    />
                                )}
                                <VoiceInput onTranscript={handleVoiceTranscript} />
                            </div>

                            {/* Text Input */}
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your question or describe the image..."
                                className="flex-1 px-4 py-3 glass border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all"
                                disabled={isLoading}
                            />

                            {/* Send Button */}
                            <button
                                onClick={handleSend}
                                disabled={isLoading || (!input.trim() && !selectedImage)}
                                className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
