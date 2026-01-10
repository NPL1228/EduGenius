import { Message } from '@/types/chat';

interface MessageBubbleProps {
    message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.sender === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 ${isUser
                        ? 'gradient-primary text-white'
                        : 'glass border border-white/10 text-gray-100'
                    }`}
            >
                {/* Display image if present */}
                {message.imageUrl && (
                    <div className="mb-3">
                        <img
                            src={message.imageUrl}
                            alt="Question image"
                            className="max-w-full max-h-60 rounded-lg border border-white/20"
                        />
                    </div>
                )}

                {/* Message content */}
                <p className="text-sm md:text-base whitespace-pre-wrap break-words">
                    {message.content}
                </p>
                <span className={`text-xs mt-2 block ${isUser ? 'text-white/70' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
}
