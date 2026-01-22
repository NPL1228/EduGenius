'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import MessageBubble from '@/components/MessageBubble';
import TypingIndicator from '@/components/TypingIndicator';
import QuickActions from '@/components/QuickActions';
import ImageUploader from '@/components/chat/ImageUploader';
import VoiceInput from '@/components/chat/VoiceInput';
import ChatHeader from '@/components/ChatHeader';

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: "👋 Hello! I'm your AI education assistant powered by Google Gemini with vision capabilities. I can help you with:\n\n• 📸 **Visual Problem Solving** - Upload images of handwritten questions, equations, or diagrams\n\n• 📝 **Step-by-step Explanations** - Get detailed breakdowns of complex concepts\n\n• 🎤 **Voice Input** - Ask questions using your voice\n\n• 💬 **Text Chat** - Type your questions directly\n\n• 🎓 **Any Subject** - Math, Science, History, Languages, and more\n\nYou can upload an image of your homework, use voice input, or type your question. How can I help you learn today?",
            sender: 'ai',
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<{
        data: string;
        mimeType: string;
        url: string;
    } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

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

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input || '(Image question)',
            sender: 'user',
            timestamp: new Date(),
            imageUrl: selectedImage?.url,
            imageData: selectedImage?.data,
            mimeType: selectedImage?.mimeType,
        };

        setMessages(prev => [...prev, userMessage]);
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
            // Clean up object URL if it exists
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

    const handleQuickAction = (message: string) => {
        setInput(message);
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Custom Chat Header */}
            <ChatHeader />

            {/* Chat Container */}
            <div className="flex-1 flex flex-col overflow-hidden pt-16">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-4">
                    {messages.map(message => (
                        <MessageBubble key={message.id} message={message} />
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
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

            {/* Quick Actions */}
            <QuickActions onActionClick={handleQuickAction} />
        </div>
    );
}
