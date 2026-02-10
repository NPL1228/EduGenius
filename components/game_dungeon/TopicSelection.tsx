"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/game_dungeon/dungeon_store';

export const TopicSelection: React.FC = () => {
    const [topicInput, setTopicInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setTopic, startGame } = useGameStore();

    const handleStart = async () => {
        if (!topicInput.trim()) return;
        setIsLoading(true);
        setTopic(topicInput.trim());
        await startGame();
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black z-0 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-8"
            >
                <div className="text-center">
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
                        EDUGEONS
                    </h1>
                    <p className="text-slate-400 font-medium">Flashcard Dungeon Crawler</p>
                </div>

                <div className="w-full flex flex-col gap-4">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">
                        What topic are you struggling with?
                    </label>
                    <input
                        type="text"
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        placeholder="e.g., Cell division, Organic Chemistry, Calculus..."
                        className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-orange-500 transition-all text-lg placeholder:text-slate-600"
                        onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                    />
                </div>

                <button
                    onClick={handleStart}
                    disabled={isLoading || !topicInput.trim()}
                    className={`w-full py-4 rounded-2xl font-black text-xl tracking-wide transition-all transform active:scale-95 shadow-lg
                        ${isLoading || !topicInput.trim()
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:shadow-orange-500/20 hover:-translate-y-1'
                        }`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ANALYZING...
                        </span>
                    ) : (
                        'START ADVENTURE'
                    )}
                </button>

                <p className="text-xs text-slate-600 text-center uppercase tracking-widest font-bold">
                    AI will analyze your topic and generate custom flashcards
                </p>
            </motion.div>
        </div>
    );
};
