"use client";

import React, { useState, useEffect } from 'react';
import NoteUploader from '@/components/notes/NoteUploader';
import NoteEditor from '@/components/notes/NoteEditor';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/types/notes';
import Link from 'next/link';


export default function NotesPage() {
    const { notes, addNote, updateNote, deleteNote, isLoading } = useNotes();
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (user?.isGuest) {
            router.push('/dashboard');
        }
    }, [user, router]);

    // Don't render content for guests to prevent flashing
    if (user?.isGuest) return null;

    // Auto-select the first note if exists and nothing selected
    if (!selectedNoteId && notes.length > 0 && !isLoading) {
        setSelectedNoteId(notes[0].id);
    }

    const handleUpload = async (data: { text?: string; fileData?: string; mimeType?: string; title: string }) => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/gemini/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate summary');
            }

            const { summary } = await response.json();

            const newNote = addNote({
                title: data.title,
                content: summary,
                type: data.fileData ? 'pdf' : 'text',
                originalContent: data.text
            });

            setSelectedNoteId(newNote.id);
        } catch (error) {
            console.error(error);
            alert('Failed to generate note. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const selectedNote = notes.find(n => n.id === selectedNoteId);

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)]">
                <div className="flex flex-col h-full gap-6">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                <span className="gradient-text">Smart Notes</span>
                            </h1>
                            <p className="text-gray-400">
                                Upload documents or paste text to generate AI-powered summaries and study guides.
                            </p>
                        </div>

                        {/* Navigation Button */}
                        <Link
                            href="/dashboard/StudyHelper"
                            className="bg-primary hover:bg-primary/90 text-white 
             px-10 py-4 text-lg font-semibold 
             rounded-2xl transition shadow-lg
             flex items-center justify-center whitespace-nowrap"
                        >
                            Lecture Mode
                        </Link>
                    </div>

                    <div className="flex items-start gap-3 h-full min-h-0">
                        {/* Sidebar List */}
                        <div className="w-full md:w-1/3 flex flex-col h-full min-h-0">
                            <NoteUploader onUpload={handleUpload} isProcessing={isProcessing} />

                            <div className="glass-card flex-1 overflow-hidden flex flex-col min-h-0">
                                <h3 className="text-lg font-semibold text-white mb-4 sticky top-0 bg-transparent">My Notes ({notes.length})</h3>
                                <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-2">
                                    {notes.length === 0 ? (
                                        <p className="text-gray-500 text-sm text-center py-8">No notes yet. Create one above!</p>
                                    ) : (
                                        notes.map(note => (
                                            <div
                                                key={note.id}
                                                onClick={() => setSelectedNoteId(note.id)}
                                                className={`p-4 rounded-lg cursor-pointer transition-all border ${selectedNoteId === note.id
                                                    ? 'bg-primary/20 border-primary/50'
                                                    : 'bg-white/5 border-transparent hover:bg-white/10'
                                                    }`}
                                            >
                                                <h4 className="font-semibold text-white truncate">{note.title}</h4>
                                                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                                                    <span>
                                                        {new Date(note.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${note.type === 'pdf' ? 'bg-red-500/20 text-red-200' : 'bg-blue-500/20 text-blue-200'}`}>
                                                        {note.type.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="hidden md:flex flex-1 h-full min-h-0">
                            {selectedNote ? (
                                <div className="w-full h-full">
                                    <NoteEditor
                                        note={selectedNote}
                                        onSave={updateNote}
                                        onDelete={(id) => {
                                            deleteNote(id);
                                            if (selectedNoteId === id) setSelectedNoteId(null);
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full glass-card flex flex-col items-center justify-center text-gray-500">
                                    <p className="text-xl">Select a note to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
