import { GameState, Flashcard } from '@/types/combine';

export class DungeonManager {
    static INITIAL_STATE: GameState = {
        heroHP: 100,
        score: 0,
        floorLevel: 1,
        currentCombo: 0,
        history: [],
    };

    static handleIncorrectAnswer(state: GameState, card: Flashcard) {
        const newState = { ...state };
        newState.heroHP = Math.max(0, newState.heroHP - 10);
        newState.currentCombo = 0;
        // Return both the new state and the hint
        return {
            newState,
            hint: card.hints[0] || "Try again!"
        };
    }

    static handleCorrectAnswer(state: GameState, card: Flashcard) {
        const newState = { ...state };
        // Base points 10, plus combo bonus
        const points = 10 + (newState.currentCombo * 5);
        newState.score += points;
        newState.currentCombo += 1;
        newState.history = [...newState.history, card];
        return newState;
    }

    static nextLevel(state: GameState) {
        const newState = { ...state };
        newState.floorLevel += 1;
        // Maybe heal a bit on level up?
        newState.heroHP = Math.min(100, newState.heroHP + 20);
        return newState;
    }
}
