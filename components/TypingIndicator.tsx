export default function TypingIndicator() {
    return (
        <div className="glass border border-white/10 p-4 rounded-2xl rounded-bl-none max-w-[75%] self-start animate-messageSlide">
            <strong className="block mb-1">EduGenius AI</strong>
            <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    );
}
