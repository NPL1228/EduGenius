export interface Flashcard {
    id: string;
    question: string;
    answer: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'boss';
    hints: string[];
}

export interface GameState {
    heroHP: number;
    score: number;
    floorLevel: number;
    currentCombo: number;
    history: Flashcard[];
    topic: string | null;
    isGameStarted: boolean;
    currentAttempts: number;
    isGameOver: boolean;
    chatMessages: { role: 'user' | 'assistant'; content: string }[];
}
