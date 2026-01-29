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
export const generateFlashcardsForTopic = async (topic: string): Promise<Flashcard[]> => {
    try {
        const response = await fetch('/api/game-dungeon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'GENERATE_CARDS', topic }),
        });

        if (!response.ok) throw new Error('Failed to generate cards');
        return await response.json();
    } catch (error) {
        console.error("Error generating cards:", error);
        return [
            {
                id: 'err-1',
                question: `Error connecting to AI. Let's try a simple one: What is 1+1?`,
                answer: '2',
                difficulty: 'easy',
                hints: ['Basic math'],
            }
        ];
    }
};

export const verifyAnswer = async (topic: string, question: string, correctAnswer: string, userAnswer: string): Promise<{ isCorrect: boolean, feedback: string }> => {
    try {
        const response = await fetch('/api/game-dungeon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'JUDGE_ANSWER', topic, question, correctAnswer, userAnswer }),
        });

        if (!response.ok) throw new Error('Failed to judge answer');
        return await response.json();
    } catch (error) {
        console.error("Error judging answer:", error);
        // Fallback to simple comparison if AI fails
        const isMatch = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
        return { isCorrect: isMatch, feedback: isMatch ? "Correct!" : "Keep trying!" };
    }
};

export const chatWithAI = async (topic: string, question: string, userMessage: string): Promise<string> => {
    try {
        const response = await fetch('/api/game-dungeon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'CHAT', topic, question, message: userMessage }),
        });

        const data = await response.json();
        return data.message || "I'm having trouble connecting right now, Hero.";
    } catch (error) {
        return "The wisdom of the Sifu is currently clouded. Try again soon.";
    }
};

export const generateStudyNotes = async (topic: string, history: Flashcard[]): Promise<string> => {
    try {
        const response = await fetch('/api/game-dungeon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'STUDY_NOTES', topic, history }),
        });

        const data = await response.json();
        return data.feedback || "Great run! Keep practicing.";
    } catch (error) {
        return "Study notes are unavailable, but your effort was noted!";
    }
};
