"use client";

import React, { useEffect } from 'react';
import { useGameStore } from '@/lib/game_dungeon/dungeon_store';
import { HeroAvatar } from './HeroAvatar';
import { CardView } from './CardView';
import { MOCK_CARDS } from '@/lib/game_dungeon/dungeon_mock-cards';
import { motion } from 'framer-motion';
import { TopicSelection } from './TopicSelection';
import { DungeonChat } from './DungeonChat';
import { GameOverScreen } from './GameOverScreen';

export const GameScreen: React.FC = () => {
    const {
        heroHP,
        score,
        floorLevel,
        currentCombo,
        currentCard,
        nextCard,
        submitAnswer,
        history,
        isGameStarted,
        currentCards,
        isGameOver,
    } = useGameStore();

    // Simple game loop: load next card from currentCards
    useEffect(() => {
        if (isGameStarted && !currentCard) {
            // Check if we reached the boss of the current set
            if (history.length > 0 && history.length % 10 === 0) {
                return;
            }

            // Small delay to simulate "walking" to next room
            const timer = setTimeout(() => {
                // Pick next card from currentCards if available, or stay in room
                const nextIndex = history.length % 10;
                if (currentCards[nextIndex]) {
                    nextCard(currentCards[nextIndex]);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentCard, nextCard, history.length, isGameStarted, currentCards]);

    if (!isGameStarted) {
        return <TopicSelection />;
    }

    if (isGameOver) {
        return <GameOverScreen />;
    }

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black z-0 pointer-events-none" />

            {/* HUD */}
            <div className="z-10 w-full max-w-4xl flex justify-between items-start mb-8 text-white">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                        Dungeon Level {floorLevel}
                    </h1>
                    <span className="text-slate-400">Score: {score}</span>
                </div>

                {currentCombo > 1 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-orange-600 px-4 py-2 rounded-full font-bold shadow-lg animate-pulse"
                    >
                        {currentCombo}x COMBO!
                    </motion.div>
                )}
            </div>

            <div className="z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left: Hero Stats */}
                <div className="flex flex-col items-center justify-center">
                    <HeroAvatar hp={heroHP} />
                    {/* Can add character sprite here later */}
                </div>

                {/* Right: Encounter */}
                <div className="flex items-center justify-center min-h-[400px]">
                    {currentCard ? (
                        <CardView
                            key={currentCard.id}
                            card={currentCard}
                            onSubmit={async (ans) => {
                                const res = submitAnswer(ans);
                                return res;
                            }}
                        />
                    ) : (
                        <div className="text-slate-500 animate-pulse font-bold text-xl">
                            {(history.length > 0 && history.length % 5 === 0)
                                ? "WARNING: BOSS APPROACHING..."
                                : "Walking to next room..."}
                        </div>
                    )}
                </div>
            </div>

            <DungeonChat />
        </div>
    );
};
