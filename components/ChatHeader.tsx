'use client';

import { useRouter } from 'next/navigation';
import ProfileDropdown from './ProfileDropdown';

export default function ChatHeader() {
    const router = useRouter();

    return (
        <div className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-xl border-b border-white/10">
            <div className="flex justify-between items-center px-4 py-3">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/10 hover:border-purple-400/50 transition-all group"
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

                {/* Profile Dropdown */}
                <ProfileDropdown />
            </div>
        </div>
    );
}
