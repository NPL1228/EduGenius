import React, { useState, useEffect } from 'react';
import { Note } from '@/types/notes';
import ReactMarkdown from 'react-markdown';


interface NoteEditorProps {
    note: Note;
    onSave: (id: string, updates: Partial<Note>) => void;
    onDelete: (id: string) => void;
}

export default function NoteEditor({ note, onSave, onDelete }: NoteEditorProps) {
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [isEditing, setIsEditing] = useState(false);

    // Sync state when note prop changes
    useEffect(() => {
        setTitle(note.title);
        setContent(note.content);
        setIsEditing(false);
    }, [note.id]);

    const handleSave = () => {
        onSave(note.id, { title, content });
        setIsEditing(false);
    };

    return (
        <div className="glass-card h-full flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                <div className="flex-1 mr-4">
                    {isEditing ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-2xl font-bold bg-transparent text-white border-b border-primary/50 focus:outline-none w-full"
                        />
                    ) : (
                        <h2 className="text-2xl font-bold text-white mb-1">{note.title}</h2>
                    )}
                    <p className="text-xs text-gray-400">
                        {new Date(note.updatedAt).toLocaleDateString()} at {new Date(note.updatedAt).toLocaleTimeString()}
                    </p>
                </div>

                <div className="flex gap-2">
                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors text-sm"
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-3 py-1 bg-primary/20 text-primary-light rounded hover:bg-primary/30 transition-colors text-sm"
                        >
                            Edit
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this note?")) onDelete(note.id);
                        }}
                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors text-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {isEditing ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-full bg-transparent text-gray-200 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                    />
                ) : (
                    <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}
