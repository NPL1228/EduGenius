import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield } from 'lucide-react';

interface HeroAvatarProps {
    hp: number;
    maxHp?: number;
}

export const HeroAvatar: React.FC<HeroAvatarProps> = ({ hp, maxHp = 100 }) => {
    const hpPercentage = Math.max(0, Math.min(100, (hp / maxHp) * 100));

    return (
        <div className="flex flex-col items-center gap-2 p-4 bg-slate-800 rounded-xl border-2 border-slate-600 shadow-lg w-full max-w-xs">
            <div className="relative w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow overflow-hidden">
                {/* Placeholder for Hero Sprite */}
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <span className="text-4xl">🦸</span>
                </motion.div>
            </div>

            <div className="w-full flex items-center gap-2">
                <Heart className="text-red-500 fill-red-500" size={24} />
                <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                    <motion.div
                        className="h-full bg-red-500"
                        initial={{ width: '100%' }}
                        animate={{ width: `${hpPercentage}%` }}
                        transition={{ type: "spring", stiffness: 100 }}
                    />
                </div>
                <span className="text-white font-bold">{hp}/{maxHp}</span>
            </div>
        </div>
    );
};
