import { useState, useEffect } from 'react';

const STREAK_KEY = 'edugenius_streak';

interface StreakData {
    currentStreak: number;
    lastCheckInDate: string | null; // ISO Date string YYYY-MM-DD
    history: string[]; // List of checked-in dates
}

export function useStreak() {
    const [streakData, setStreakData] = useState<StreakData>({
        currentStreak: 0,
        lastCheckInDate: null,
        history: []
    });
    const [isCheckedInToday, setIsCheckedInToday] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem(STREAK_KEY);
        if (stored) {
            try {
                const parsed: StreakData = JSON.parse(stored);
                setStreakData(parsed);

                const today = new Date().toISOString().split('T')[0];
                if (parsed.lastCheckInDate === today) {
                    setIsCheckedInToday(true);
                } else {
                    // Check if streak is broken (missed yesterday)
                    const lastDate = new Date(parsed.lastCheckInDate || 0);
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayString = yesterday.toISOString().split('T')[0];

                    if (parsed.lastCheckInDate !== yesterdayString && parsed.lastCheckInDate !== today) {
                        // Streak broken! But we don't reset until they check in today, 
                        // or we can allow "grace" visually. For strict logic:
                        // If they missed yesterday, streak is technically 0 pending next check-in?
                        // Let's reset display to 0 if missed yesterday
                        // Actually, logic is usually: Calculate streak on load based on last date

                        const diffTime = Math.abs(new Date(today).getTime() - lastDate.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays > 1) {
                            // More than 1 day gap = broken
                            // We don't write to storage yet, just update state for display?
                            // Or we keep old streak but show it might be lost?
                            // Simple: if diff > 1, currentStreak display is 0
                        }
                    }
                }
            } catch (e) {
                console.error("Error parsing streak", e);
            }
        }
    }, []);

    const checkIn = () => {
        const today = new Date().toISOString().split('T')[0];
        if (isCheckedInToday) return;

        setStreakData(prev => {
            let newStreak = prev.currentStreak;

            // Check if consecutive
            if (prev.lastCheckInDate) {
                const lastDate = new Date(prev.lastCheckInDate);
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayString = yesterday.toISOString().split('T')[0];

                if (prev.lastCheckInDate === yesterdayString) {
                    newStreak += 1;
                } else {
                    // Reset if not consecutive (and not today re-checkin which is caught by isCheckedInToday)
                    newStreak = 1;
                }
            } else {
                newStreak = 1;
            }

            const newData = {
                currentStreak: newStreak,
                lastCheckInDate: today,
                history: [...prev.history, today]
            };

            localStorage.setItem(STREAK_KEY, JSON.stringify(newData));
            return newData;
        });

        setIsCheckedInToday(true);
        return true;
    };

    return {
        streak: streakData.currentStreak,
        isCheckedInToday,
        checkIn,
        mounted
    };
}
