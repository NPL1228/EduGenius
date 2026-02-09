import { Task, UnavailableTime } from "@/app/planner/page";
import { useMemo, useState, useRef, useEffect } from "react";

type WeeklyScheduleProps = {
    tasks: Task[];
    currentDate: Date;
    unavailableTimes?: UnavailableTime[];
    preferredRestTime?: number;
    onSlotClick?: (date: Date) => void;
    onTaskClick?: (task: Task) => void;
    onTaskChange?: (task: Task) => void;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i); // 0 to 23
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PIXELS_PER_HOUR = 64;

export default function WeeklySchedule({
    tasks,
    currentDate,
    unavailableTimes = [],
    preferredRestTime = 30,
    onSlotClick,
    onTaskClick,
    onTaskChange
}: WeeklyScheduleProps) {
    const weekDates = useMemo(() => {
        const start = startOfWeek(currentDate);
        return Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    }, [currentDate]);

    // Drag & Drop State
    const [dragState, setDragState] = useState<{
        taskId: string;
        action: 'move' | 'resize';
        initialY: number;
        initialStart: number; // Hours (float)
        initialDuration: number; // Minutes
    } | null>(null);

    const [tempTask, setTempTask] = useState<Task | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handlePointerDown = (e: React.PointerEvent, t: Task, action: 'move' | 'resize') => {
        e.preventDefault();
        e.stopPropagation();
        const el = e.currentTarget as HTMLElement;
        try {
            el.setPointerCapture(e.pointerId);
        } catch (e) {
            // ignore
        }

        const start = new Date(t.startTime!);
        const startH = start.getHours() + start.getMinutes() / 60;

        setDragState({
            taskId: t.id,
            action,
            initialY: e.clientY,
            initialStart: startH,
            initialDuration: t.minutes
        });
        setTempTask({ ...t });
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragState || !tempTask) return;
        e.preventDefault();

        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;

        // Calculate time change (Y axis)
        const relY = e.clientY - containerRect.top + containerRef.current!.scrollTop;
        const hour = Math.max(0, Math.min(23.5, relY / PIXELS_PER_HOUR));

        // Snap to 15 min (0.25h)
        const snap = (val: number) => Math.round(val * 4) / 4;

        if (dragState.action === 'move') {
            // Calculate day change (X axis)
            const colWidth = containerRect.width / 8;
            const relX = e.clientX - containerRect.left;

            // Col 0 is time labels, Cols 1-7 are days
            const colIndex = Math.floor(relX / colWidth);
            const dayIndex = Math.max(0, Math.min(6, colIndex - 1));

            const newStartHour = snap(hour);
            const newDate = new Date(weekDates[dayIndex]);
            newDate.setHours(Math.floor(newStartHour), (newStartHour % 1) * 60, 0, 0);

            // Limit within day bounds based on duration
            const endHour = newStartHour + (tempTask.minutes / 60);

            if (endHour <= 24) {
                setTempTask({ ...tempTask, startTime: newDate.toISOString() });
            }
        } else if (dragState.action === 'resize') {
            const deltaPixels = e.clientY - dragState.initialY;
            const deltaHours = deltaPixels / PIXELS_PER_HOUR;

            let newDuration = dragState.initialDuration + (deltaHours * 60);
            newDuration = Math.max(15, newDuration); // Min 15 mins
            newDuration = Math.round(newDuration / 15) * 15; // Snap to 15m

            if (newDuration !== tempTask.minutes) {
                setTempTask({ ...tempTask, minutes: newDuration });
            }
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!dragState || !tempTask) return;
        e.preventDefault();
        const el = e.currentTarget as HTMLElement;
        try {
            el.releasePointerCapture(e.pointerId);
        } catch (e) {
            // ignore
        }

        onTaskChange?.(tempTask);
        setDragState(null);
        setTempTask(null);
    };

    // Check conflict and rest violation
    const checkStatus = (t: Task, dayIndex: number) => {
        if (!t.startTime) return { hasConflict: false, hasRestViolation: false };
        const start = new Date(t.startTime);
        const startH = start.getHours() + start.getMinutes() / 60;
        const endH = startH + (t.minutes / 60);

        // Check against unavailable times
        const hasConflict = unavailableTimes.some(ut => {
            if (!ut.days.includes(dayIndex)) return false;
            const ranges = ut.startHour > ut.endHour
                ? [[ut.startHour, 24], [0, ut.endHour]]
                : [[ut.startHour, ut.endHour]];
            return ranges.some(([uStart, uEnd]) => startH < uEnd && endH > uStart);
        }) || tasks.some(other => {
            if (other.id === t.id || !other.startTime || !isSameDay(new Date(other.startTime), new Date(t.startTime!))) return false;
            const oStart = new Date(other.startTime);
            const oStartH = oStart.getHours() + oStart.getMinutes() / 60;
            const oEndH = oStartH + (other.minutes / 60);
            return startH < oEndH && endH > oStartH;
        });

        // Check rest violation: detect if any other study block is within preferredRestTime
        const restBuffer = preferredRestTime / 60;
        const hasRestViolation = tasks.some(other => {
            if (other.id === t.id || !other.startTime || !isSameDay(new Date(other.startTime), new Date(t.startTime!))) return false;
            const oStart = new Date(other.startTime);
            const oStartH = oStart.getHours() + oStart.getMinutes() / 60;
            const oEndH = oStartH + (other.minutes / 60);

            // Violation if: 
            // 1. This task starts before (other.end + buffer) AND after other.start
            // 2. This task ends after (other.start - buffer) AND before other.end
            // Essentially, if the gap between sessions is < restBuffer
            const gapAfterOther = startH - oEndH;
            const gapBeforeOther = oStartH - endH;

            // Only check when gap is positive but too small
            return (gapAfterOther >= 0 && gapAfterOther < restBuffer) ||
                (gapBeforeOther >= 0 && gapBeforeOther < restBuffer);
        });

        return { hasConflict, hasRestViolation };
    };

    return (
        <div className="flex flex-col h-[700px] overflow-hidden glass rounded-2xl shadow-sm border border-white/10 relative select-none">
            {/* Header */}
            <div className="grid grid-cols-8 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-md z-20 sticky top-0">
                <div className="p-3 text-xs font-semibold text-center text-gray-400 border-r border-gray-200 dark:border-white/10 flex items-center justify-center">Time</div>
                {weekDates.map((d, i) => (
                    <div key={i} className="p-2 text-center border-r border-gray-200 dark:border-white/10 last:border-r-0">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{WEEK_DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1]}</div>
                        <div className={`text-lg font-bold ${isToday(d) ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                            {d.getDate()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div ref={containerRef} className="overflow-y-auto flex-1 relative bg-white/50 dark:bg-[#0b1020]/50 backdrop-blur-sm scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                <div className="grid grid-cols-8 min-h-[1536px] relative"> {/* 24h * 64px = 1536px */}

                    {/* Hour Lines */}
                    <div className="col-span-8 absolute inset-0 z-0 pointer-events-none">
                        {HOURS.map((h, i) => (
                            <div key={h} className="absolute w-full border-t border-gray-100 dark:border-white/5 border-dashed" style={{ top: `${i * 64}px` }} />
                        ))}
                    </div>

                    {/* Left Time Labels */}
                    <div className="border-r border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 z-0 sticky left-0">
                        {HOURS.map((h) => (
                            <div key={h} className="h-16 text-xs text-gray-400 p-2 text-right relative -top-3">
                                {h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
                            </div>
                        ))}
                    </div>

                    {/* Columns */}
                    {weekDates.map((day, dayIndex) => (
                        <div key={dayIndex} className="relative border-r border-gray-200 dark:border-white/10 last:border-r-0 z-10 group/day">

                            {/* Unavailable Zones */}
                            {unavailableTimes.filter(ut => ut.days.includes(dayIndex)).map((ut, idx) => {
                                const ranges = ut.startHour > ut.endHour
                                    ? [[ut.startHour, 24], [0, ut.endHour]]
                                    : [[ut.startHour, ut.endHour]];

                                return ranges.map((r, ri) => (
                                    <div key={`${ut.id}-${idx}-${ri}`} className="absolute w-full bg-gray-100/50 dark:bg-white/5 pointer-events-none flex items-center justify-center"
                                        style={{ top: `${r[0] * 64}px`, height: `${(r[1] - r[0]) * 64}px`, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.03) 5px, rgba(0,0,0,0.03) 10px)' }}
                                    >
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest rotate-90 sm:rotate-0">{ut.label}</span>
                                    </div>
                                ));
                            })}

                            {/* Clickable Slots */}
                            {HOURS.map((h) => (
                                <div key={h} className="h-16 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                                    onClick={() => {
                                        const slot = new Date(day);
                                        slot.setHours(h);
                                        onSlotClick?.(slot);
                                    }}
                                />
                            ))}

                            {/* Tasks */}
                            {tasks
                                .filter(t => t.startTime && isSameDay(new Date(t.startTime), day))
                                .map(t => {
                                    // If dragging this task, show tempTask instead
                                    const isDragging = dragState?.taskId === t.id;
                                    const displayTask = isDragging ? tempTask! : t;

                                    // If we are dragging, we might have moved it to another day
                                    // But we are inside .map(day), so we only show the task if it belongs to THIS day.
                                    if (isDragging) {
                                        if (!isSameDay(new Date(displayTask.startTime!), day)) return null;
                                    }

                                    const start = new Date(displayTask.startTime!);
                                    const startH = start.getHours() + start.getMinutes() / 60;
                                    const top = startH * 64;
                                    const height = (displayTask.minutes / 60) * 64;
                                    const { hasConflict, hasRestViolation } = checkStatus(displayTask, dayIndex);

                                    return (
                                        <div
                                            key={t.id}
                                            className={`
                                                absolute left-1 right-1 rounded-lg p-2 text-xs overflow-hidden cursor-grab active:cursor-grabbing
                                                hover:scale-[1.02] transition-transform shadow-sm ring-1 hover:z-30
                                                ${hasConflict ? 'ring-red-500 bg-red-500/20 animate-pulse' : hasRestViolation ? 'ring-amber-500 bg-amber-500/10' : 'ring-white/20'}
                                                ${isDragging ? 'z-50 shadow-xl scale-105 opacity-90' : 'z-10'}
                                            `}
                                            style={{
                                                top: `${top}px`,
                                                height: `${Math.max(24, height)}px`,
                                                backgroundColor: hasConflict ? undefined : hasRestViolation ? (displayTask.color || '#4f46e5') : (displayTask.color || '#4f46e5'),
                                                color: 'white',
                                                border: `1px solid ${hasConflict ? 'rgba(239, 68, 68, 0.5)' : hasRestViolation ? 'rgba(245, 158, 11, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                                                boxShadow: isDragging ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none',
                                            }}
                                            onPointerDown={(e) => handlePointerDown(e, t, 'move')}
                                            onPointerMove={handlePointerMove}
                                            onPointerUp={handlePointerUp}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!dragState) onTaskClick?.(t);
                                            }}
                                        >
                                            {hasConflict && (
                                                <div className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl-lg z-20 shadow-sm flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    <span className="text-[8px] font-black uppercase">Conflict</span>
                                                </div>
                                            )}
                                            {!hasConflict && hasRestViolation && (
                                                <div className="absolute top-0 right-0 p-1 bg-amber-500 text-white rounded-bl-lg z-20 shadow-sm flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-[8px] font-black uppercase">Short Rest</span>
                                                </div>
                                            )}
                                            <div className="font-bold truncate pointer-events-none pr-6">{displayTask.subject}</div>
                                            <div className="opacity-90 truncate text-[10px] pointer-events-none">{displayTask.title}</div>

                                            {/* Resize Handle */}
                                            <div
                                                className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize flex justify-center items-end hover:bg-black/10 group/resize"
                                                onPointerDown={(e) => handlePointerDown(e, t, 'resize')}
                                            >
                                                <div className="w-8 h-1 bg-white/30 group-hover/resize:bg-white/60 rounded-full mb-1 transition-colors" />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Helpers
function startOfWeek(d: Date) {
    const n = new Date(d);
    const day = (n.getDay() + 6) % 7; // Mon is 0
    n.setDate(n.getDate() - day);
    n.setHours(0, 0, 0, 0);
    return n;
}

function isToday(d: Date) {
    const today = new Date();
    return d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();
}

function isSameDay(a: Date, b: Date) {
    return a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear();
}
