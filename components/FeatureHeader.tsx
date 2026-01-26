'use client';

import { useRouter } from 'next/navigation';
import ProfileDropdown from './ProfileDropdown';

interface FeatureHeaderProps {
    title?: string;
}

export default function FeatureHeader({ title }: FeatureHeaderProps) {
    const router = useRouter();

    return (
        <div className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-xl border-b border-white/10">
            <div className="relative flex justify-between items-center px-4 py-3">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/10 hover:border-purple-400/50 transition-all group z-10"
                >
                    <svg
                        className="w-5 h-5 text-gray-300 group-hover:text-purple-400 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-gray-300 group-hover:text-purple-400 transition-colors font-medium">
                        Back
                    </span>
                </button>

                {/* Centered Title */}
                {title && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            {title}
                        </h1>
                    </div>
                )}

                {/* Profile Dropdown */}
                <div className="z-10">
                    <ProfileDropdown />
                </div>
            </div>
        </div>
    );
}
