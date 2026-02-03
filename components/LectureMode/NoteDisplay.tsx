import Markdown from "react-markdown";

interface NoteDisplayProps {
    content: string;
}

export function NoteDisplay({ content }: NoteDisplayProps) {
    return (
        <div className="glass-card w-full p-6 mt-6 bg-white/5 border border-white/10 rounded-2xl shadow-xl">
            <div className="prose prose-invert max-w-none">
                {/* ✨ 使用 react-markdown 渲染内容 */}
                <Markdown
                    components={{
                        // 自定义样式：让标题和列表更漂亮
                        h3: ({ node, ...props }) => <h3 className="text-2xl font-bold text-primary mt-4 mb-2" {...props} />,
                        p: ({ node, ...props }) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
                        li: ({ node, ...props }) => <li className="text-gray-300 list-disc ml-4 mb-1" {...props} />,
                        hr: () => <hr className="my-6 border-white/10" />,
                        strong: ({ node, ...props }) => <strong className="text-white font-semibold" {...props} />,
                    }}
                >
                    {content}
                </Markdown>
            </div>
        </div>
    );
}