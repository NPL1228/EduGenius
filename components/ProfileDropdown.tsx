'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const getInitial = () => {
        return user?.username.charAt(0).toUpperCase() || 'U';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-1.5 rounded-xl glass border border-white/10 hover:border-purple-400/50 transition-all group"
            >
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-purple-500/50 transition-all">
                    {getInitial()}
                </div>
                <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-white">{user?.username}</div>
                    <div className="text-xs text-purple-400">
                        {user?.isGuest ? '👋 Guest' : '✨ Member'}
                    </div>
                </div>
                <svg
                    className={`w-4 h-4 text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute -right-12 mt-2 w-56 z-50 animate-fadeInUp">
                    {/* Glass layer (STATIC, no animation) */}
                    <div className="absolute inset-0 glass rounded-xl pointer-events-none" />

                    {/* Content layer */}
                    <div className="relative bg-black/60 border border-white/10 rounded-xl shadow-xl py-2">

                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-white/10">
                            <div className="text-sm font-semibold text-white">
                                {user?.username}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                {user?.isGuest ? "Guest Account" : "Member Account"}
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/10 hover:text-purple-400 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                                <span className="font-medium">Dashboard</span>
                            </Link>

                            <Link
                                href="/dashboard/notes"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/10 hover:text-purple-400 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="font-medium">Smart Notes</span>
                            </Link>

                            <Link
                                href="/settings"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/10 hover:text-purple-400 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <span className="font-medium">Settings</span>
                            </Link>

                            <div className="border-t border-white/10 my-2" />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/15 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
