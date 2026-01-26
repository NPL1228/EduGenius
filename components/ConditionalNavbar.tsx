'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
    const pathname = usePathname();

    // Hide navbar on feature pages
    if (pathname === '/chat' || pathname?.startsWith('/game_dungeon') || pathname === '/notes') {
        return null;
    }

    return <Navbar />;
}
