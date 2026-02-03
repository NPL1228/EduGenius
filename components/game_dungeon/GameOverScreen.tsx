"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/game_dungeon/dungeon_store';
import { Skull, RefreshCw, BookOpen } from 'lucide-react';

export const GameOverScreen: React.FC = () => {
    const { score, floorLevel, topic, gameOverFeedback, resetGame } = useGameStore();

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Blood Red Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black z-0 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-10 w-full max-w-2xl bg-slate-900/50 backdrop-blur-xl border-2 border-red-900/50 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center gap-8"
            >
                <div className="flex flex-col items-center gap-2">
                    <Skull size={80} className="text-red-500 mb-4 animate-bounce" />
                    <h1 className="text-6xl font-black text-white tracking-tighter">YOU PERISHED</h1>
                    <p className="text-red-400 font-bold uppercase tracking-widest">Dungeon Level {floorLevel} conquered</p>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full">
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                        <p className="text-slate-500 text-xs font-bold uppercase">Final Score</p>
                        <p className="text-3xl font-black text-yellow-500">{score}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                        <p className="text-slate-500 text-xs font-bold uppercase">Topic Mastered</p>
                        <p className="text-3xl font-black text-blue-400 truncate px-2">{topic}</p>
                    </div>
                </div>

                <div className="w-full bg-slate-800/80 rounded-2xl p-6 text-left border border-slate-700 max-h-60 overflow-y-auto">
                    <div className="flex items-center gap-2 text-orange-400 font-bold mb-4 border-b border-white/10 pb-2">
                        <BookOpen size={20} />
                        <span>AI Sifu's Critique & Study Notes</span>
                    </div>

                    {gameOverFeedback ? (
                        <div className="prose prose-invert prose-orange text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                            {gameOverFeedback}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-8 gap-3 text-slate-500">
                            <div className="w-4 h-4 border-2 border-slate-600 border-t-orange-500 rounded-full animate-spin" />
                            AI is analyzing your journey...
                        </div>
                    )}
                </div>

                <button
                    onClick={resetGame}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl font-black text-xl tracking-wide hover:shadow-red-500/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 shadow-lg group"
                >
                    <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" />
                    TRY AGAIN
                </button>
            </motion.div>
        </div>
    );
};
