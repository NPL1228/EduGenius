export interface Note {
    id: string;
    title: string;
    content: string; // The full content or summary
    originalContent?: string; // If summarized from a longer text/PDF
    createdAt: number;
    updatedAt: number;
    type: 'text' | 'pdf' | 'image';
    tags?: string[];
}

export type CreateNoteInput = Pick<Note, 'title' | 'content' | 'type'> & { originalContent?: string };
