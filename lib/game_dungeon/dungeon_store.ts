import { create } from 'zustand';
import { GameState, Flashcard } from '@/types/combine';
import { DungeonManager } from './dungeon-manager';
import { generateBossMonster } from './dungeon_ai-service';

interface GameStore extends GameState {
    currentCard: Flashcard | null;
    currentCards: Flashcard[];
    gameOverFeedback: string | null;
    nextCard: (card: Flashcard) => void;
    submitAnswer: (answer: string) => Promise<{ correct: boolean; message?: string }>;
    resetGame: () => void;
    setTopic: (topic: string) => void;
    startGame: () => Promise<void>;
    submitChatMessage: (message: string) => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
    ...DungeonManager.INITIAL_STATE,
    currentCard: null,
    currentCards: [],
    gameOverFeedback: null,

    nextCard: (card: Flashcard) => {
        set({ currentCard: card, currentAttempts: 0, chatMessages: [] });
    },

    submitAnswer: async (answer: string) => {
        const state = get();
        const { currentCard } = state;

        if (!currentCard) return { correct: false, message: "No card active" };

        let isCorrect = answer.trim().toLowerCase() === currentCard.answer.trim().toLowerCase();
        let aiFeedback = "";

        // Fallback to AI if not an exact match
        if (!isCorrect) {
            const { verifyAnswer } = await import('./dungeon_ai-service');
            const result = await verifyAnswer(
                state.topic || 'General',
                currentCard.question,
                currentCard.answer,
                answer
            );
            isCorrect = result.isCorrect;
            aiFeedback = result.feedback;
        }

        if (isCorrect) {
            const newState = DungeonManager.handleCorrectAnswer(state, currentCard);
            set({ ...newState, currentCard: null, currentAttempts: 0 });

            if (newState.history.length % 10 === 0) {
                const { generateBossMonster } = await import('./dungeon_ai-service');
                generateBossMonster(newState.history).then((bossCard) => {
                    get().nextCard(bossCard);
                });
            }

            return { correct: true, message: aiFeedback || "Perfect strike!" };
        } else {
            const { newState, hint } = DungeonManager.handleIncorrectAnswer(state, currentCard);
            const newAttempts = state.currentAttempts + 1;
            const isGameOver = newState.heroHP <= 0;

            set({ ...newState, currentAttempts: newAttempts, isGameOver });

            if (isGameOver) {
                const { generateStudyNotes } = await import('./dungeon_ai-service');
                generateStudyNotes(state.topic || 'General', state.history).then((feedback: string) => {
                    set({ gameOverFeedback: feedback });
                });
            }

            return { correct: false, message: aiFeedback || hint };
        }
    },

    resetGame: () => {
        set({
            ...DungeonManager.INITIAL_STATE,
            currentCard: null,
            currentCards: [],
            gameOverFeedback: null
        });
    },

    setTopic: (topic: string) => {
        set({ topic });
    },

    startGame: async () => {
        const { topic } = get();
        if (!topic) return;

        // In a real implementation, we would call the AI service here
        // For now, let's update the AI service to have this method
        const { generateFlashcardsForTopic } = await import('./dungeon_ai-service');
        const cards = await generateFlashcardsForTopic(topic);

        set({
            isGameStarted: true,
            currentCards: cards,
            currentCard: cards[0],
            currentAttempts: 0,
            chatMessages: []
        });
    },

    submitChatMessage: async (message: string) => {
        const state = get();
        const currentMsgs = state.chatMessages;
        const newMsgs = [...currentMsgs, { role: 'user', content: message } as const];

        set({ chatMessages: newMsgs });

        const { chatWithAI } = await import('./dungeon_ai-service');
        const response = await chatWithAI(
            state.topic || 'General',
            state.currentCard?.question || '',
            message
        );

        set({
            chatMessages: [...newMsgs, { role: 'assistant', content: response } as const]
        });
    }
}));
