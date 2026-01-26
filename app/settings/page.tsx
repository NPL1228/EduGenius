'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import Link from 'next/link';

function ProfileEditForm({ user }: { user: any }) {
    const { updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(user?.username || '');

    const handleSave = () => {
        updateProfile({ username });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="flex gap-2 w-full">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 px-4 py-3 glass border border-purple-400 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all"
                    autoFocus
                />
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
                >
                    Save
                </button>
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setUsername(user?.username || '');
                    }}
                    className="px-4 py-2 glass hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-colors"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <div className="flex justify-between items-center w-full px-4 py-3 glass border border-white/10 rounded-xl">
            <span className="text-white font-medium">{user?.username}</span>
            <button
                onClick={() => setIsEditing(true)}
                className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors"
            >
                Edit
            </button>
        </div>
    );
}

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="min-h-screen pt-24 px-4 pb-12">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
                    <p className="text-gray-400">Manage your account preferences and settings</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-4 space-y-2">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeTab === 'profile'
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                                    : 'text-gray-300 hover:text-purple-400 hover:bg-white/5'
                                    }`}
                            >
                                👤 Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('appearance')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeTab === 'appearance'
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                                    : 'text-gray-300 hover:text-purple-400 hover:bg-white/5'
                                    }`}
                            >
                                🎨 Appearance
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeTab === 'notifications'
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                                    : 'text-gray-300 hover:text-purple-400 hover:bg-white/5'
                                    }`}
                            >
                                🔔 Notifications
                            </button>
                            <button
                                onClick={() => setActiveTab('privacy')}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeTab === 'privacy'
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                                    : 'text-gray-300 hover:text-purple-400 hover:bg-white/5'
                                    }`}
                            >
                                🔒 Privacy
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'profile' && (
                            <div className="glass-card p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">Username</label>
                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                value={user?.username || ''}
                                                onChange={(e) => {
                                                    // This is instant update - for a real app usually you'd have local state + save button
                                                    // But for this simple requirement, we can update context directly or better: use local state + explicit save
                                                }}
                                                // Let's implement local state approach below in a separate EditProfile component logic block
                                                // Actually, let's keep it simple within this component
                                                disabled
                                                className="hidden" // Hiding this dummy input to replace with actual implementation below
                                            />
                                            <ProfileEditForm user={user} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">Account Type</label>
                                        <div className="glass border border-white/10 rounded-xl px-4 py-3">
                                            <span className="text-purple-400 font-semibold">
                                                {user?.isGuest ? '👋 Guest Account' : '✨ Member Account'}
                                            </span>
                                            <p className="text-sm text-gray-400 mt-1">
                                                All features unlocked
                                            </p>
                                        </div>
                                    </div>

                                    {user?.isGuest && (
                                        <div className="bg-purple-500/10 border border-purple-500/50 rounded-xl p-4">
                                            <p className="text-purple-400 mb-2">
                                                <strong>Guest Account Notice</strong>
                                            </p>
                                            <p className="text-gray-300 text-sm mb-3">
                                                Your progress won't be saved permanently. Create an account to save your learning journey!
                                            </p>
                                            <Link
                                                href="/signup"
                                                className="gradient-primary text-white px-4 py-2 rounded-lg font-semibold text-sm inline-block hover:scale-105 transition-all"
                                            >
                                                Create Account
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="glass-card p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">Appearance Settings</h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-gray-300 mb-3 font-medium">Theme</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button className="glass border border-purple-500/50 rounded-xl p-4 text-left">
                                                <div className="text-2xl mb-2">🌙</div>
                                                <div className="text-white font-semibold">Dark Mode</div>
                                                <div className="text-xs text-purple-400 mt-1">Active</div>
                                            </button>
                                            <button className="glass border border-white/10 rounded-xl p-4 text-left opacity-50">
                                                <div className="text-2xl mb-2">☀️</div>
                                                <div className="text-white font-semibold">Light Mode</div>
                                                <div className="text-xs text-gray-400 mt-1">Coming Soon</div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="glass-card p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>

                                <div className="space-y-4">
                                    {[
                                        { label: 'Learning Reminders', desc: 'Get reminded about your daily learning goals' },
                                        { label: 'Achievement Alerts', desc: 'Notifications when you earn new badges' },
                                        { label: 'Study Streak Updates', desc: 'Keep track of your learning streaks' },
                                        { label: 'Weekly Progress Report', desc: 'Get weekly summaries of your progress' }
                                    ].map((item, index) => (
                                        <div key={index} className="glass border border-white/10 rounded-xl p-4 flex items-center justify-between">
                                            <div>
                                                <div className="text-white font-medium">{item.label}</div>
                                                <div className="text-sm text-gray-400">{item.desc}</div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'privacy' && (
                            <div className="glass-card p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">Privacy & Security</h2>

                                <div className="space-y-6">
                                    <div className="glass border border-white/10 rounded-xl p-4">
                                        <div className="text-white font-medium mb-2">Data Collection</div>
                                        <p className="text-sm text-gray-400 mb-3">
                                            We collect minimal data to improve your learning experience. Your conversations and progress are stored securely.
                                        </p>
                                        <Link href="#" className="text-purple-400 hover:text-purple-300 text-sm">
                                            Learn more about our privacy policy →
                                        </Link>
                                    </div>

                                    {!user?.isGuest && (
                                        <div className="glass border border-white/10 rounded-xl p-4">
                                            <div className="text-white font-medium mb-2">Change Password</div>
                                            <p className="text-sm text-gray-400 mb-3">
                                                Update your password to keep your account secure
                                            </p>
                                            <button className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
                                                Update Password →
                                            </button>
                                        </div>
                                    )}

                                    <div className="glass border border-red-500/20 rounded-xl p-4">
                                        <div className="text-white font-medium mb-2">Delete Account</div>
                                        <p className="text-sm text-gray-400 mb-3">
                                            Permanently delete your account and all associated data
                                        </p>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                                    logout();
                                                    window.location.href = '/';
                                                }
                                            }}
                                            className="text-red-400 hover:text-red-300 text-sm font-semibold"
                                        >
                                            Delete Account →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Back to Dashboard */}
                <div className="mt-8 text-center">
                    <Link
                        href="/dashboard"
                        className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-2 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
