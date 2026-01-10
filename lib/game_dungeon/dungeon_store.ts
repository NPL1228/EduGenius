import { create } from 'zustand';
import { GameState, Flashcard } from '@/types/combine';
import { DungeonManager } from './dungeon-manager';
import { generateBossMonster } from './dungeon_ai-service';

interface GameStore extends GameState {
    currentCard: Flashcard | null;
    nextCard: (card: Flashcard) => void;
    submitAnswer: (answer: string) => { correct: boolean; message?: string };
    resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
    ...DungeonManager.INITIAL_STATE,
    currentCard: null,

    nextCard: (card: Flashcard) => {
        set({ currentCard: card });
    },

    submitAnswer: (answer: string) => {
        const state = get();
        const { currentCard } = state;

        if (!currentCard) return { correct: false, message: "No card active" };

        const isCorrect = answer.trim().toLowerCase() === currentCard.answer.trim().toLowerCase();

        if (isCorrect) {
            const newState = DungeonManager.handleCorrectAnswer(state, currentCard);
            set({ ...newState, currentCard: null });

            // Check for Boss Condition (e.g., every 5 cards)
            if (newState.history.length % 5 === 0) {
                // Trigger Boss
                generateBossMonster(newState.history).then((bossCard) => {
                    get().nextCard(bossCard);
                });
            }

            return { correct: true };
        } else {
            const { newState, hint } = DungeonManager.handleIncorrectAnswer(state, currentCard);
            set({ ...newState });
            return { correct: false, message: hint };
        }
    },

    resetGame: () => {
        set({ ...DungeonManager.INITIAL_STATE, currentCard: null });
    }
}));
