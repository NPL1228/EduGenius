import FeatureCard from '@/components/FeatureCard';
import Link from 'next/link';

export default function FeaturesPage() {
    return (
        <div className="min-h-screen pt-20 px-4 pb-16">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 mt-12">
                    <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6 animate-fadeInUp">
                        Powerful Features for Modern Learners
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        Discover how EduGenius helps you understand, practice, and master any subject
                    </p>
                </div>

                {/* Core Features */}
                <section className="mb-24">
                    <div className="space-y-24">
                        {/* AI Tutor */}
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6">
                                <div className="text-5xl mb-4">🤖</div>
                                <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                                    Intelligent AI Tutor
                                </h2>
                                <p className="text-xl text-gray-300">
                                    Your personal 24/7 study companion. It's more than just a chatbot—it's a multimodal tutor that can see, hear, and understand.
                                </p>
                                <ul className="space-y-4 text-gray-400">
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span><strong>Multimodal Input:</strong> Upload images of complex math problems or diagrams, or use voice commands to ask questions naturally.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span><strong>Context-Aware Explanations:</strong> Get instant, step-by-step breakdowns of any concept, tailored to your learning style.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span><strong>Interactive Chat:</strong> Engage in deep conversations with history context, allowing for follow-up questions and clarifications.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex-1 w-full relative">
                                <div className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-20 blur-lg"></div>
                                    <div className="relative space-y-4">
                                        <div className="flex justify-end"><div className="bg-purple-600 text-white px-4 py-2 rounded-2xl rounded-tr-none text-sm">Can you explain this calculus problem?</div></div>
                                        <div className="flex justify-start"><div className="glass text-gray-200 px-4 py-2 rounded-2xl rounded-tl-none text-sm">I see you've uploaded an image of an integral. Let's break it down using the substitution method...</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Smart Note Taker */}
                        <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                            <div className="flex-1 space-y-6">
                                <div className="text-5xl mb-4">📝</div>
                                <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                                    Smart Note Taker
                                </h2>
                                <p className="text-xl text-gray-300">
                                    Transform raw information into structured knowledge instantly.
                                </p>
                                <ul className="space-y-4 text-gray-400">
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span><strong>Instant Summarization:</strong> Paste text or upload PDF/Image files to get concise, structured summaries automatically generated by Gemini AI.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span><strong>Key Point Extraction:</strong> Automatically identifies definitions, dates, and formulas so you never miss important details.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span><strong>Markdown Support:</strong> Create beautiful, organized notes with full rich-text formatting capabilities.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex-1 w-full">
                                <div className="glass-card h-64 flex items-center justify-center border border-white/10">
                                    <div className="text-center space-y-4 opacity-50">
                                        <div className="text-6xl">📄</div>
                                        <p>Processing Resume.pdf...</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Game Dungeon */}
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6">
                                <div className="text-5xl mb-4">⚔️</div>
                                <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                                    Game Dungeon
                                </h2>
                                <p className="text-xl text-gray-300">
                                    Turn studying into an adventure. Master topics to defeat enemies and clear floors.
                                </p>
                                <ul className="space-y-4 text-gray-400">
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span><strong>RPG Mechanics:</strong> You have Health Points (HP). Answer correctly to attack; get it wrong and take damage!</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span><strong>Boss Battles:</strong> Face challenging "Boss" questions at the end of every level to test your mastery.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span><strong>Streak System:</strong> Build combos with consecutive correct answers to unlock special achievements.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex-1 w-full">
                                <div className="glass-card aspect-video relative overflow-hidden rounded-xl border border-red-500/30">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                                    <div className="absolute bottom-4 left-4 z-20 text-white font-mono">
                                        <div>HERO HP: ████████ 100%</div>
                                        <div className="text-red-400">ENEMY: MATH GOBLIN</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Smart AI Planner */}
                        <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                            <div className="flex-1 space-y-6">
                                <div className="text-5xl mb-4">📅</div>
                                <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                                    Smart AI Planner
                                </h2>
                                <p className="text-xl text-gray-300">
                                    Take control of your time with an intelligent, interactive schedule manager.
                                </p>
                                <ul className="space-y-4 text-gray-400">
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span><strong>Drag & Drop Schedule:</strong> Easily organize your week by dragging task blocks to your preferred time slots.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span><strong>Smart Conflict Detection:</strong> The planner automatically alerts you if you double-book or schedule over unavailable times.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1">✓</span>
                                        <span><strong>Visual Time Blocking:</strong> Get a clear, color-coded view of your weekly study plan to maximize productivity.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex-1 w-full">
                                <div className="glass-card p-4 rounded-xl space-y-2 border border-blue-500/30">
                                    <div className="h-2 w-full bg-white/10 rounded"></div>
                                    <div className="flex gap-2">
                                        <div className="w-16 h-16 bg-blue-600/50 rounded-lg flex items-center justify-center text-xs">Phy</div>
                                        <div className="w-16 h-16 bg-purple-600/50 rounded-lg flex items-center justify-center text-xs ml-8">Chem</div>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* CTA */}
                <div className="text-center">
                    <div className="glass-card p-12 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
                            Ready to Experience These Features?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Start learning smarter today with EduGenius - your AI-powered learning companion
                        </p>
                        <Link
                            href="/chat"
                            className="gradient-primary text-white px-10 py-5 rounded-xl font-semibold text-xl shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 inline-block"
                        >
                            Start Learning Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
