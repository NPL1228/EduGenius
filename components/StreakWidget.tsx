import { useState, useEffect } from 'react';
import { useStreak } from '@/hooks/useStreak';

export default function StreakWidget() {
    const { streak, isCheckedInToday, checkIn, mounted } = useStreak();
    const [motivation, setMotivation] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Fetch motivation on mount if already checked in, or when checking in
    const fetchMotivation = async (currentStreak: number, force: boolean = false) => {
        if (!force && !isCheckedInToday) return; // Don't fetch if not checked in (unless forced manually)

        // Check local storage for today's motivation to avoid refetching
        const today = new Date().toDateString();
        const storedMotivation = localStorage.getItem('edugenius_daily_motivation');

        if (storedMotivation && !force) {
            const parsed = JSON.parse(storedMotivation);
            if (parsed.date === today && parsed.message) {
                setMotivation(parsed.message);
                return;
            }
        }

        setLoading(true);
        try {
            // Get simple activity stats (mocked or from storage if available, for now simplified)
            const storedHistory = localStorage.getItem('chatHistory');
            const chatCount = storedHistory ? JSON.parse(storedHistory).length : 0;
            const storedNotes = localStorage.getItem('edugenius_notes');
            const noteCount = storedNotes ? JSON.parse(storedNotes).length : 0;

            const response = await fetch('/api/gemini/motivation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    streak: currentStreak,
                    activity: {
                        chats: chatCount,
                        notes: noteCount
                    }
                })
            });
            const data = await response.json();
            if (data.motivation) {
                setMotivation(data.motivation);
                // Save to local storage
                localStorage.setItem('edugenius_daily_motivation', JSON.stringify({
                    date: today,
                    message: data.motivation
                }));
            }
        } catch (e) {
            console.error(e);
            setMotivation("Keep pushing forward!");
        } finally {
            setLoading(false);
        }
    };

    // Initial check
    useEffect(() => {
        if (mounted) {
            if (isCheckedInToday) {
                fetchMotivation(streak);
            } else {
                setMotivation("You haven't checked in today");
            }
        }
    }, [mounted, isCheckedInToday]);

    const handleCheckIn = async () => {
        const success = checkIn();
        if (success) {
            // Fetch motivation immediately + streak increment 
            // Note: useStreak checkIn updates local state but we might need to wait or rely on isCheckedInToday changing
            // Actually, checkIn returns synchronous success, but state update is async. 
            // Better to force fetch here with (streak + 1)
            await fetchMotivation(streak + 1, true);
        }
    };

    if (!mounted) return null;

    return (
        <div className="glass-card p-6 w-full relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-2xl">🔥</span> Daily Streak
                    </h3>
                    <p className="text-gray-400 text-sm">Build your learning habit</p>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-bold text-orange-400">{streak}</div>
                    <div className="text-xs text-orange-400/80 font-medium">DAYS</div>
                </div>
            </div>

            <div className="space-y-4">
                {/* Motivation Text */}
                <div className="glass bg-white/5 p-3 rounded-lg border border-white/5 min-h-[60px] flex items-center justify-center text-center">
                    {loading ? (
                        <div className="animate-pulse w-full">
                            <div className="h-2 bg-white/10 rounded mb-2 w-3/4 mx-auto"></div>
                            <div className="h-2 bg-white/10 rounded w-1/2 mx-auto"></div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-200 italic">"{motivation}"</p>
                    )}
                </div>

                {/* Check In Button */}
                <button
                    onClick={handleCheckIn}
                    disabled={isCheckedInToday || loading}
                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isCheckedInToday
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-default'
                        : 'gradient-primary text-white hover:scale-[1.02] shadow-lg hover:shadow-purple-500/25'
                        }`}
                >
                    {isCheckedInToday ? (
                        <>
                            <span>✅</span> Checked In
                        </>
                    ) : (
                        <>
                            <span>📍</span> Check In
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
