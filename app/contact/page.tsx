'use client';

import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Reset success message after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000);
    };

    return (
        <div className="min-h-screen pt-20 px-4 pb-16">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 mt-12">
                    <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6 animate-fadeInUp">
                        Get In Touch
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        Have questions, feedback, or need assistance? We'd love to hear from you!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="glass-card p-8">
                        <h2 className="text-3xl font-bold text-white mb-6">Send Us a Message</h2>

                        {submitStatus === 'success' && (
                            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                                <p className="text-green-400 font-semibold">✅ Message sent successfully! We'll get back to you soon.</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-gray-300 mb-2 font-medium">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 glass border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 glass border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-gray-300 mb-2 font-medium">
                                    Subject *
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 glass border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-purple-400 transition-all"
                                >
                                    <option className="text-black" value="">Select a subject</option>
                                    <option className="text-black" value="general">General Inquiry</option>
                                    <option className="text-black" value="support">Technical Support</option>
                                    <option className="text-black" value="feedback">Feedback</option>
                                    <option className="text-black" value="partnership">Partnership</option>
                                    <option className="text-black" value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-gray-300 mb-2 font-medium">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 glass border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all resize-none"
                                    placeholder="Tell us how we can help you..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full gradient-primary text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="glass-card p-8">
                            <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="text-3xl">📧</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">Email</h3>
                                        <a href="mailto:support@edugenius.ai" className="text-purple-400 hover:text-purple-300 transition-colors">
                                            support@edugenius.ai
                                        </a>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="text-3xl">💬</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">Live Chat</h3>
                                        <p className="text-gray-300">Available Mon-Fri, 9AM-5PM EST</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="text-3xl">🌐</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">Social Media</h3>
                                        <div className="flex gap-4 mt-2">
                                            <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Twitter</a>
                                            <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Discord</a>
                                            <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">LinkedIn</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                            <p className="text-gray-300 mb-4">
                                Before reaching out, you might find your answer in our FAQ section.
                            </p>
                            <div className="space-y-3">
                                <details className="glass p-4 rounded-lg cursor-pointer">
                                    <summary className="text-white font-semibold">How does EduGenius work?</summary>
                                    <p className="text-gray-300 mt-2">
                                        EduGenius uses Google's Gemini AI to provide intelligent tutoring. It guides you through problems
                                        with hints and explanations rather than giving direct answers.
                                    </p>
                                </details>
                                <details className="glass p-4 rounded-lg cursor-pointer">
                                    <summary className="text-white font-semibold">Is EduGenius free?</summary>
                                    <p className="text-gray-300 mt-2">
                                        We offer a free tier with basic features. Premium plans unlock advanced capabilities and unlimited usage.
                                    </p>
                                </details>
                                <details className="glass p-4 rounded-lg cursor-pointer">
                                    <summary className="text-white font-semibold">What subjects does it support?</summary>
                                    <p className="text-gray-300 mt-2">
                                        EduGenius supports Math, Science, English, History, and many more subjects across all grade levels.
                                    </p>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
