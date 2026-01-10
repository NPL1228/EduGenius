'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const [isGuest, setIsGuest] = useState<boolean | null>(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        const guest = JSON.parse(user || "{}");
        setIsGuest(guest?.isGuest);
    }, []);

    if (isGuest === null) return null;

    return (
        <div className="min-h-screen pt-30 px-4 pb-16">
            <div className="max-w-7xl mx-auto">
                {/* Guest Banner */}
                {isGuest && (
                    <div className="mb-8 mt-8">
                        <div className="glass-card p-6 border-2 border-yellow-500/30 bg-yellow-500/5">
                            <div className="flex items-start gap-4">
                                <div className="text-3xl">⚠️</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-yellow-400 mb-2">Guest Mode - Limited Features</h3>
                                    <p className="text-gray-300 mb-4">
                                        You're currently using EduGenius as a guest. Some features are limited and your progress won't be saved.
                                    </p>
                                    <Link
                                        href="/signup"
                                        className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 inline-block"
                                    >
                                        Create Account to Unlock Full Features
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Welcome Section */}
                <div className="mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
                        Welcome to Your Learning Dashboard
                    </h1>
                    <p className="text-xl text-gray-300">
                        {isGuest ? "Start exploring EduGenius features below" : "Track your progress and continue learning"}
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <Link href="/chat" className="glass-card hover:border-purple-400/50 transition-all group">
                        <div className="text-5xl mb-4">💬</div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                            Start Learning
                        </h3>
                        <p className="text-gray-400">Chat with your AI tutor</p>
                    </Link>

                    <Link href="/dashboard/notes" className="glass-card hover:border-purple-400/50 transition-all group">
                        <div className="text-5xl mb-4">📝</div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                            My Notes
                        </h3>
                        <p className="text-gray-400">View and manage your notes</p>
                    </Link>

                    <Link href="/game_dungeon" className="glass-card hover:border-purple-400/50 transition-all group">
                        <div className="text-5xl mb-4">🎮</div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                            Game Dungeon
                        </h3>
                        <p className="text-gray-400">Learn through gaming</p>
                    </Link>

                    <div className="glass-card opacity-50 cursor-not-allowed">
                        <div className="text-5xl mb-4">📊</div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            My Progress {isGuest && "🔒"}
                        </h3>
                        <p className="text-gray-400">
                            {isGuest ? "Sign up to track progress" : "View your learning stats"}
                        </p>
                    </div>
                </div>

                {/* Features Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="glass-card p-8">
                        <h2 className="text-3xl font-bold gradient-text mb-6">Learning Modes</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="text-3xl">🎓</div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Explain Mode</h3>
                                    <p className="text-gray-300">Get detailed explanations of any concept</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-3xl">💪</div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Practice Mode</h3>
                                    <p className="text-gray-300">Generate practice problems to reinforce learning</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-3xl">🎯</div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Quiz Mode</h3>
                                    <p className="text-gray-300">Test your knowledge with AI-generated quizzes</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-3xl">💡</div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Hint Mode</h3>
                                    <p className="text-gray-300">Get progressive hints to solve problems yourself</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <h2 className="text-3xl font-bold gradient-text mb-6">Quick Tips</h2>
                        <div className="space-y-4">
                            <div className="glass p-4 rounded-lg">
                                <p className="text-white font-semibold mb-2">✨ Ask Clear Questions</p>
                                <p className="text-sm text-gray-300">
                                    The more specific your question, the better the AI can help you understand.
                                </p>
                            </div>
                            <div className="glass p-4 rounded-lg">
                                <p className="text-white font-semibold mb-2">📸 Use Images</p>
                                <p className="text-sm text-gray-300">
                                    Upload diagrams, equations, or textbook pages for visual learning.
                                </p>
                            </div>
                            <div className="glass p-4 rounded-lg">
                                <p className="text-white font-semibold mb-2">🎯 Request Hints First</p>
                                <p className="text-sm text-gray-300">
                                    Try to solve problems yourself with hints before asking for full explanations.
                                </p>
                            </div>
                            <div className="glass p-4 rounded-lg">
                                <p className="text-white font-semibold mb-2">📝 Practice Regularly</p>
                                <p className="text-sm text-gray-300">
                                    Generate practice problems to strengthen your understanding.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA for Guests */}
                {isGuest && (
                    <div className="text-center">
                        <div className="glass-card p-12 max-w-3xl mx-auto border-2 border-purple-500/30">
                            <div className="text-5xl mb-6">🚀</div>
                            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
                                Unlock Your Full Learning Potential
                            </h2>
                            <p className="text-xl text-gray-300 mb-8">
                                Create an account to save your progress, earn achievements, and get personalized learning recommendations!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/signup"
                                    className="gradient-primary text-white px-10 py-5 rounded-xl font-semibold text-xl shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 inline-block"
                                >
                                    Create Free Account
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
