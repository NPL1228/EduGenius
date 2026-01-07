'use client';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface GuestSignupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GuestSignupModal({ isOpen, onClose }: GuestSignupModalProps) {
    const [visible, setVisible] = useState(isOpen);
    const router = useRouter();
    const { loginAsGuest } = useAuth();

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
        } else {
            // wait for fade-out animation
            const timer = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleGuestLogin = () => {
        // Generate a random guest name
        const guestName = `Guest${Math.floor(Math.random() * 10000)}`;
        loginAsGuest(guestName);
        router.push('/dashboard');
    };

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${isOpen ? "animate-fadeInUp" : "animate-fadeOutDown"}`}
        >
            {/* Backdrop: dim ONLY, NO blur */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
            />

            {/* Modal wrapper (animated, NO blur) */}
            <div className="relative z-10 max-w-lg w-full mx-auto">

                {/* Glass layer (STATIC, handles blur) */}
                <div className="absolute inset-0 glass rounded-2xl pointer-events-none" />

                {/* Content layer */}
                <div className="relative bg-black/60 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        aria-label="Close"
                    >
                        ✕
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

                        {/* Inner glass card */}
                        <div className="relative rounded-lg overflow-hidden">
                            <div className="absolute inset-0 glass pointer-events-none" />
                            <div className="relative bg-black/40 p-4">
                                <p className="text-sm text-gray-400">
                                    <strong className="text-purple-400">With an account:</strong> Save your progress, track achievements, get personalized recommendations, and access your learning history across devices.
                                </p>
                            </div>
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

                        <button
                            onClick={handleGuestLogin}
                            className="w-full glass border border-white/20 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:border-purple-400/50 transition-all"
                        >
                            Continue as Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
