'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { GameScreen } from '@/components/game_dungeon/GameScreen';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.isGuest) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user?.isGuest) return null;

  return (
    <main>
      <GameScreen />
    </main>
  );
}
