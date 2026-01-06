import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-20 px-4 pb-16">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 mt-12">
                    <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6 animate-fadeInUp">
                        About EduGenius
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        An AI learning companion that explains, quizzes, and guides — without giving final answers
                    </p>
                </div>

                {/* Mission */}
                <section className="mb-16">
                    <div className="glass-card p-8">
                        <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
                            Our Mission
                        </h2>
                        <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                            At EduGenius, we believe that true learning comes from understanding, not just getting the right answer.
                            Our mission is to empower students with an AI companion that helps them develop critical thinking skills,
                            build genuine understanding, and become independent learners.
                        </p>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            We're not here to do your homework for you — we're here to help you understand the concepts so you can
                            confidently solve problems on your own.
                        </p>
                    </div>
                </section>

                {/* Our Approach */}
                <section className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-center gradient-text mb-12">
                        Our Ethical Approach to AI Learning
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-card p-6">
                            <div className="text-4xl mb-4">✅</div>
                            <h3 className="text-2xl font-bold text-white mb-3">We Help You Understand</h3>
                            <p className="text-gray-300">
                                Our AI breaks down complex concepts into digestible explanations, uses analogies you can relate to,
                                and adapts to your learning level.
                            </p>
                        </div>
                        <div className="glass-card p-6">
                            <div className="text-4xl mb-4">🎯</div>
                            <h3 className="text-2xl font-bold text-white mb-3">We Guide, Don't Solve</h3>
                            <p className="text-gray-300">
                                Instead of giving direct answers, we provide progressive hints and ask guiding questions to help
                                you think through problems yourself.
                            </p>
                        </div>
                        <div className="glass-card p-6">
                            <div className="text-4xl mb-4">💪</div>
                            <h3 className="text-2xl font-bold text-white mb-3">We Help You Practice</h3>
                            <p className="text-gray-300">
                                Generate unlimited practice problems to reinforce your learning. The more you practice,
                                the stronger your understanding becomes.
                            </p>
                        </div>
                        <div className="glass-card p-6">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-2xl font-bold text-white mb-3">We Track Your Progress</h3>
                            <p className="text-gray-300">
                                Monitor your learning journey with quizzes, achievements, and progress tracking.
                                See how far you've come and identify areas to improve.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Why Choose EduGenius */}
                <section className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-center gradient-text mb-12">
                        Why Choose EduGenius?
                    </h2>
                    <div className="glass-card p-8">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="text-3xl">🤖</div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Powered by Google Gemini AI</h3>
                                    <p className="text-gray-300">
                                        Leveraging state-of-the-art AI technology to provide accurate, helpful, and contextual responses.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-3xl">🎓</div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Educational Integrity</h3>
                                    <p className="text-gray-300">
                                        Designed with teachers and educators in mind. Safe for school use and promotes honest academic work.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-3xl">🌟</div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Fun & Engaging</h3>
                                    <p className="text-gray-300">
                                        Learning doesn't have to be boring! Gamification, achievements, and interactive features make studying enjoyable.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-3xl">⚡</div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Always Available</h3>
                                    <p className="text-gray-300">
                                        Study whenever inspiration strikes. Your AI tutor is available 24/7, ready to help you learn.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Values */}
                <section className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-center gradient-text mb-12">
                        Our Core Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-6 text-center">
                            <div className="text-4xl mb-4">💎</div>
                            <h3 className="text-xl font-bold text-white mb-3">Integrity</h3>
                            <p className="text-gray-300">
                                We promote honest learning and academic ethics in all our features.
                            </p>
                        </div>
                        <div className="glass-card p-6 text-center">
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold text-white mb-3">Innovation</h3>
                            <p className="text-gray-300">
                                Constantly improving our AI to provide better learning experiences.
                            </p>
                        </div>
                        <div className="glass-card p-6 text-center">
                            <div className="text-4xl mb-4">❤️</div>
                            <h3 className="text-xl font-bold text-white mb-3">Student-First</h3>
                            <p className="text-gray-300">
                                Every feature is designed with student success and understanding in mind.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="text-center">
                    <div className="glass-card p-12">
                        <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
                            Join Our Learning Community
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Start your journey to better understanding today
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
