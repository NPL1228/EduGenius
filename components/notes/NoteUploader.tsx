import React, { useState, useRef } from 'react';

interface NoteUploaderProps {
    onUpload: (data: { text?: string; fileData?: string; mimeType?: string; title: string }) => void;
    isProcessing: boolean;
}

export default function NoteUploader({ onUpload, isProcessing }: NoteUploaderProps) {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                let encoded = reader.result?.toString().replace(/^data:(.*,)?/, '') || '';
                resolve(encoded);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text && !file) return;

        let payload: any = { title: file ? file.name : 'New Text Note' };

        if (file) {
            const base64Data = await toBase64(file);
            payload.fileData = base64Data;
            payload.mimeType = file.type;
        }

        if (text) {
            payload.text = text;
            if (!payload.title && text) {
                payload.title = text.slice(0, 20) + '...';
            }
        }

        onUpload(payload);
        setText('');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="glass-card mb-4">
            <h3 className="text-xl font-semibold mb-4 text-white">Create New Note</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <textarea
                        className="w-full p-4 rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors text-sm md:text-base min-h-[100px]"
                        placeholder="Type your notes here or copy/paste content..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-full md:w-auto flex-1">
                        <input
                            type="file"
                            accept="application/pdf,image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            ref={fileInputRef}
                        />
                        <label
                            htmlFor="file-upload"
                            className={`flex items-center justify-center w-full px-4 py-3 rounded-lg border border-dashed border-white/20 cursor-pointer hover:bg-white/5 transition-colors ${file ? 'text-green-400 border-green-500/50' : 'text-gray-400'}`}
                        >
                            <span className="mr-2">📎</span>
                            {file ? file.name : 'Upload PDF or Image (Optional)'}
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing || (!text && !file)}
                        className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-all ${isProcessing || (!text && !file)
                            ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                            : 'bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/20'
                            }`}
                    >
                        {isProcessing ? 'Thinking...' : '✨ Summarize & Create'}
                    </button>
                </div>
            </form>
        </div>
    );
}
