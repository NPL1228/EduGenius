import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard } from '@/types/combine';
import { Send } from 'lucide-react';
import { useGameStore } from '@/lib/game_dungeon/dungeon_store';

interface CardViewProps {
    card: Flashcard;
    onSubmit: (answer: string) => Promise<{ correct: boolean; message?: string }>;
}

export const CardView: React.FC<CardViewProps> = ({ card, onSubmit }) => {
    const [answer, setAnswer] = useState('');
    const [isError, setIsError] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { currentAttempts } = useGameStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const result = await onSubmit(answer);
        setIsSubmitting(false);

        if (!result.correct) {
            setIsError(true);
            setFeedback(result.message || "Incorrect!");
            // Reset shake animation after short delay
            setTimeout(() => setIsError(false), 500);
        } else {
            setAnswer('');
            setFeedback(null);
        }
    };

    return (
        <motion.div
            className={`relative w-full max-w-lg p-8 rounded-2xl shadow-2xl border-4 ${card.difficulty === 'boss' ? 'bg-red-900 border-red-500' : 'bg-white border-slate-200'
                }`}
            animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
        >
            <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${card.difficulty === 'boss' ? 'bg-red-500 text-white' : 'bg-blue-100 text-blue-800'
                    }`}>
                    {card.difficulty} Encounter
                </span>
            </div>

            <h2 className={`text-2xl font-bold mb-8 ${card.difficulty === 'boss' ? 'text-white' : 'text-slate-800'}`}>
                {card.question}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full p-4 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:outline-none text-lg text-slate-800 placeholder:text-slate-400"
                    autoFocus
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 transition-all font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95
                        ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Judging...</span>
                        </>
                    ) : (
                        <>
                            <span>Attack!</span>
                            <Send size={20} />
                        </>
                    )}
                </button>
            </form>

            <AnimatePresence>
                {(feedback || currentAttempts >= 3) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`mt-4 p-4 rounded-lg flex flex-col gap-2 ${currentAttempts >= 3
                            ? 'bg-orange-100 border border-orange-300 text-orange-800'
                            : 'bg-yellow-100 border border-yellow-300 text-yellow-800'
                            }`}
                    >
                        <p className="flex items-center gap-2">
                            🛡️ <strong>{currentAttempts >= 3 ? 'Reveal' : 'Hint'}:</strong> {feedback}
                        </p>
                        {currentAttempts >= 3 && (
                            <div className="mt-1 pt-2 border-t border-orange-200">
                                <p className="text-sm font-black uppercase text-orange-600 mb-1">Correct Answer:</p>
                                <p className="text-xl font-mono bg-white/50 p-2 rounded border border-orange-200 text-center">
                                    {card.answer}
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
