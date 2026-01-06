import FeatureCard from '@/components/FeatureCard';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6 animate-fadeInUp">
            Your AI-Powered Learning Companion
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Unlock your full potential with EduGenius - an intelligent personal education assistant
            powered by Google Gemini AI. Get instant help 24/7 with homework, understand complex
            concepts, and accelerate your learning journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/chat"
              className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 inline-block"
            >
              Start Learning Now
            </Link>
            <Link
              href="#features"
              className="glass text-white px-8 py-4 rounded-xl font-semibold text-lg hover:border-purple-400/50 transition-all inline-block"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="min-h-screen flex items-center justify-center py-20 px-4" id="features">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center gradient-text mb-4">
            Why Students Love EduGenius
          </h2>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-16">
            An AI companion that helps you understand, practice, and master any subject
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon="🖼️"
              title="Visual Learning"
              description="Upload images of diagrams, equations, or textbook pages. Our multimodal AI can analyze and explain visual content instantly."
            />
            <FeatureCard
              icon="🗣️"
              title="Interactive Assistant"
              description="Engage in natural dialogue with your AI tutor. Ask follow-up questions, request examples, and explore topics in depth."
            />
            <FeatureCard
              icon="🎮"
              title="Gamified Quizzes"
              description="Challenge yourself with interactive quizzes to test your knowledge and track your progress."
            />
          </div>

          {/* Link to Full Features Page */}
          <div className="text-center">
            <Link
              href="/features"
              className="glass text-purple-400 px-8 py-4 rounded-xl font-semibold text-lg hover:border-purple-400/50 transition-all inline-flex items-center gap-2 group"
            >
              View All Features
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center gradient-text mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card text-center">
              <div className="text-6xl mb-6">1️⃣</div>
              <h3 className="text-2xl font-bold text-white mb-4">Ask Your Question</h3>
              <p className="text-gray-400">Type your question or upload an image of your problem</p>
            </div>

            <div className="glass-card text-center">
              <div className="text-6xl mb-6">2️⃣</div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Analysis</h3>
              <p className="text-gray-400">Google Gemini processes your query using advanced AI</p>
            </div>

            <div className="glass-card text-center">
              <div className="text-6xl mb-6">3️⃣</div>
              <h3 className="text-2xl font-bold text-white mb-4">Learn & Grow</h3>
              <p className="text-gray-400">Receive clear explanations and continue the conversation</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-[60vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of students who are already learning smarter with EduGenius
            </p>
            <Link
              href="/chat"
              className="gradient-primary text-white px-10 py-5 rounded-xl font-semibold text-xl shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 inline-block"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
