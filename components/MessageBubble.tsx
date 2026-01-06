import { Message } from '@/types/chat';

interface MessageBubbleProps {
    message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.sender === 'user';

    return (
        <div
            className={`max-w-[75%] p-4 rounded-2xl animate-messageSlide ${isUser
                    ? 'self-end gradient-primary text-white rounded-br-none'
                    : 'self-start glass border border-white/10 rounded-bl-none'
                }`}
        >
            <strong className="block mb-1">{isUser ? 'You' : 'EduGenius AI'}</strong>
            <p className={isUser ? 'text-white' : 'text-gray-300'}>{message.content}</p>
        </div>
    );
}
