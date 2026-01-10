import { Flashcard } from '@/types/combine';

// In a real app, this would call Vercel AI SDK
export const generateBossMonster = async (pastCards: Flashcard[]): Promise<Flashcard> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Generating boss based on:", pastCards.map(c => c.question));

    return {
        id: `boss-${Date.now()}`,
        question: "BOSS: Combine the concepts of variables and functions into a single explanation.",
        answer: "closures", // Mock answer
        difficulty: 'boss',
        hints: [
            "It allows functions to remember their lexical scope.",
            "Think about inner functions."
        ],
    };
};
