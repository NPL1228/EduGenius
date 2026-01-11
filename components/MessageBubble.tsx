import { Message } from '@/types/chat';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

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
                <div className={`text-sm md:text-base break-words ${isUser ? 'text-white' : 'text-gray-100'} prose prose-sm md:prose-base dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0 text-inherit leading-normal`}>
                    <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                            a: ({ node, ...props }) => <a className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                            code: ({ node, ...props }) => {
                                // @ts-ignore
                                const { inline, className, children } = props;
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                    <code className={`${className} bg-black/30 rounded px-1 py-0.5`} {...props}>
                                        {children}
                                    </code>
                                ) : (
                                    <code className="bg-black/30 rounded px-1 py-0.5" {...props}>
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>
                <span className={`text-xs mt-2 block ${isUser ? 'text-white/70' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
}
