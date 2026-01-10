import { useState, useEffect } from 'react';
import { Note, CreateNoteInput } from '@/types/notes';

const STORAGE_KEY = 'edugenius_notes';

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load notes from local storage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setNotes(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load notes', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Save notes to local storage whenever they change
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        }
    }, [notes, isLoading]);

    const addNote = (input: CreateNoteInput) => {
        const newNote: Note = {
            id: crypto.randomUUID(),
            ...input,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        setNotes(prev => [newNote, ...prev]);
        return newNote;
    };

    const updateNote = (id: string, updates: Partial<Note>) => {
        setNotes(prev => prev.map(note =>
            note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
        ));
    };

    const deleteNote = (id: string) => {
        setNotes(prev => prev.filter(note => note.id !== id));
    };

    return {
        notes,
        isLoading,
        addNote,
        updateNote,
        deleteNote
    };
}
