'use client';
import { useEffect, useState } from "react";
import Link from 'next/link';

interface GuestSignupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GuestSignupModal({ isOpen, onClose }: GuestSignupModalProps) {
    const [visible, setVisible] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
        } else {
            // wait for fade-out animation
            const timer = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!visible) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${isOpen ? "animate-fadeInUp" : "animate-fadeOutDown"}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-xl"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-lg w-full mx-auto shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Icon */}
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">👋</div>
                    <h2 className="text-3xl font-bold gradient-text mb-3">
                        Guest Mode
                    </h2>
                </div>

                {/* Message */}
                <div className="mb-8">
                    <p className="text-lg text-gray-300 text-center mb-4">
                        It is <strong className="text-white">recommended to sign up using an account</strong> so that our personalized assistant can provide services with full potential and more suitable personally.
                    </p>
                    <div className="glass p-4 rounded-lg">
                        <p className="text-sm text-gray-400">
                            <strong className="text-purple-400">With an account:</strong> Save your progress, track achievements, get personalized recommendations, and access your learning history across devices.
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                    <Link
                        href="/signup"
                        className="w-full gradient-primary text-white px-6 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 text-center"
                    >
                        Continue with an Account
                    </Link>
                    <Link
                        href="/dashboard"
                        className="w-full glass border border-white/20 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:border-purple-400/50 transition-all text-center"
                    >
                        Continue as Guest
                    </Link>
                </div>
            </div>
        </div>
    );
}
