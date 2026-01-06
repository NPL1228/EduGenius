'use client';

import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 glass backdrop-blur-xl border-b border-white/10 animate-slideDown">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold font-['Outfit'] gradient-primary bg-clip-text px-6 py-2.5 rounded-xl">
                    ✨ EduGenius
                </Link>

                <ul className="hidden md:flex gap-8 items-center">
                    <li>
                        <Link
                            href="/features"
                            className="text-gray-300 hover:text-purple-400 transition-colors font-medium"
                        >
                            Features
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/about"
                            className="text-gray-300 hover:text-purple-400 transition-colors font-medium"
                        >
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/contact"
                            className="text-gray-300 hover:text-purple-400 transition-colors font-medium"
                        >
                            Contact
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/login"
                            className="gradient-primary text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 inline-block"
                        >
                            Start Learning
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
