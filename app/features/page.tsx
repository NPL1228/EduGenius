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

                {/* Core Learning Features */}
                <section className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-center gradient-text mb-12">
                        Core Learning Capabilities
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon="💡"
                            title="Instant Explanations"
                            description="Get clear, detailed explanations for any topic. Our AI breaks down complex concepts into easy-to-understand language tailored to your level."
                        />
                        <FeatureCard
                            icon="🎯"
                            title="Guided Problem Solving"
                            description="Stuck on a problem? Get step-by-step guidance without just giving away the answer. Learn the process, not just the solution."
                        />
                        <FeatureCard
                            icon="🧩"
                            title="Concept Breakdown"
                            description="Complex topics made simple. We break down difficult concepts into smaller, digestible pieces that build on each other."
                        />
                        <FeatureCard
                            icon="📝"
                            title="Practice Problems"
                            description="Generate unlimited practice problems similar to what you're studying. Perfect for reinforcing your understanding."
                        />
                        <FeatureCard
                            icon="🎓"
                            title="Progressive Hints"
                            description="Get hints that guide you towards the solution without giving it away. Multiple hint levels help you find the answer yourself."
                        />
                        <FeatureCard
                            icon="✅"
                            title="Understanding Checks"
                            description="Quick quizzes to test your comprehension. Make sure you truly understand before moving forward."
                        />
                    </div>
                </section>

                {/* Interactive Features */}
                <section className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-center gradient-text mb-12">
                        Interactive Learning Tools
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon="🖼️"
                            title="Visual Learning"
                            description="Upload images of diagrams, equations, or textbook pages. Our multimodal AI can analyze and explain visual content instantly."
                        />
                        <FeatureCard
                            icon="🗣️"
                            title="Interactive Conversations"
                            description="Engage in natural dialogue with your AI tutor. Ask follow-up questions, request examples, and explore topics in depth."
                        />
                        <FeatureCard
                            icon="🎮"
                            title="Gamified Quizzes"
                            description="Challenge yourself with interactive quizzes to test your knowledge and track your progress with fun achievements."
                        />
                        <FeatureCard
                            icon="📊"
                            title="Progress Tracking"
                            description="Monitor your learning journey with detailed progress reports, topic mastery levels, and study streaks."
                        />
                        <FeatureCard
                            icon="🏆"
                            title="Achievements & Badges"
                            description="Earn badges as you learn! Unlock achievements for completing challenges, maintaining study streaks, and mastering topics."
                        />
                        <FeatureCard
                            icon="⚡"
                            title="24/7 Availability"
                            description="Study on your schedule. Your AI assistant is always ready to help, whether it's midnight or midday."
                        />
                    </div>
                </section>

                {/* Subject-Specific Features */}
                <section className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-center gradient-text mb-12">
                        Subject-Specific Support
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon="🧮"
                            title="Math & Calculus"
                            description="Step-by-step problem solving, equation explanations, and formula breakdowns."
                        />
                        <FeatureCard
                            icon="🔬"
                            title="Science (Physics, Chemistry, Biology)"
                            description="Concept explanations, reaction mechanisms, and experimental analysis."
                        />
                        <FeatureCard
                            icon="📖"
                            title="Language & Writing"
                            description="Grammar help, essay structure, vocabulary building, and creative writing support."
                        />
                        <FeatureCard
                            icon="🌍"
                            title="History & Social Studies"
                            description="Event analysis, historical context, and critical thinking development."
                        />
                    </div>
                </section>

                {/* Learning Modes */}
                <section className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-center gradient-text mb-12">
                        Flexible Learning Modes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-card">
                            <div className="text-5xl mb-4">🎓</div>
                            <h3 className="text-2xl font-bold text-white mb-3">Explain Mode</h3>
                            <p className="text-gray-300">
                                Get detailed explanations of concepts with examples, analogies, and real-world applications.
                                Perfect for learning something new or reviewing material.
                            </p>
                        </div>
                        <div className="glass-card">
                            <div className="text-5xl mb-4">💪</div>
                            <h3 className="text-2xl font-bold text-white mb-3">Practice Mode</h3>
                            <p className="text-gray-300">
                                Generate similar problems to practice your skills. Get immediate feedback and detailed
                                solutions to reinforce your understanding.
                            </p>
                        </div>
                        <div className="glass-card">
                            <div className="text-5xl mb-4">🎯</div>
                            <h3 className="text-2xl font-bold text-white mb-3">Quiz Mode</h3>
                            <p className="text-gray-300">
                                Test your knowledge with AI-generated quizzes. Multiple choice, short answer, and more.
                                Track your scores and identify areas for improvement.
                            </p>
                        </div>
                        <div className="glass-card">
                            <div className="text-5xl mb-4">💡</div>
                            <h3 className="text-2xl font-bold text-white mb-3">Hint Mode</h3>
                            <p className="text-gray-300">
                                Get progressive hints that guide you towards the answer without giving it away.
                                Learn to think through problems independently.
                            </p>
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
