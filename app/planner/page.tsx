

"use client";

import FeatureHeader from '@/components/FeatureHeader';
import WeeklySchedule from '@/components/WeeklySchedule';
import TaskModal from '@/components/TaskModal';
import { useEffect, useMemo, useState } from "react";

export type UnavailableTime = {
  id: string;
  startHour: number;
  endHour: number;
  days: number[]; // 0=Mon, ... 6=Sun (or based on WEEK_DAYS index)
  label: string;
};

export type Task = {
  id: string;
  subject: string;
  title: string;
  minutes: number;
  deadline?: string;
  completed?: boolean;
  startTime?: string; // ISO string for the start time
  importance?: number; // 0-100
  difficulty?: number; // 0-100
  color?: string;
  notes?: string;
  isPinned?: boolean; // If true, AI won't re-schedule this task
};

const SUBJECT_COLORS: Record<string, string> = {
  Math: "#3b82f6", // Blue
  CS: "#8b5cf6",   // Violet
  Physics: "#ec4899", // Pink
  English: "#f59e0b", // Amber
  Chemistry: "#10b981", // Emerald
  History: "#ef4444", // Red
};

const getSubjectColor = (subject: string) => SUBJECT_COLORS[subject] || "#6366f1"; // Default Indigo

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function formatShort(date: Date) {
  return date.getDate();
}

export default function PlannerPage() {
  const today = new Date();
  // Helper to create a start time for today at a specific hour
  const getTodayAt = (h: number) => {
    const d = new Date();
    d.setHours(h, 0, 0, 0);
    return d.toISOString();
  };



  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", subject: "Math", title: "Integration Practice", minutes: 45, deadline: "2026-02-15", color: getSubjectColor("Math"), importance: 80, difficulty: 70 },
    { id: "2", subject: "CS", title: "BFS Revision", minutes: 30, deadline: "2026-02-12", color: getSubjectColor("CS"), importance: 90, difficulty: 85 },
    { id: "3", subject: "Physics", title: "Chapter 3 Notes", minutes: 60, deadline: "2026-02-20", color: getSubjectColor("Physics"), importance: 75, difficulty: 80 },
    { id: "4", subject: "English", title: "Essay Draft", minutes: 45, deadline: "2026-02-18", color: getSubjectColor("English"), importance: 60, difficulty: 50 },
    { id: "5", subject: "Chemistry", title: "Organic Chemistry Lab", minutes: 90, deadline: "2026-02-25", color: getSubjectColor("Chemistry"), importance: 85, difficulty: 75 },
    { id: "6", subject: "History", title: "World War Analysis", minutes: 55, deadline: "2026-02-22", color: getSubjectColor("History"), importance: 70, difficulty: 65 },
  ]);



  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [aiSuggestion, setAiSuggestion] = useState<string>(
    "You have a Physics quiz in 2 days. Consider prioritising Physics tonight and moving English to tomorrow."
  );
  const [dark, setDark] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, 1 = next week, etc.
  const [showHistory, setShowHistory] = useState(false);
  const [newTask, setNewTask] = useState<{ subject: string; title: string; estimated_minutes: number; deadline: string; startTime: string; importance: number; difficulty: number }>({
    subject: 'Math',
    title: '',
    estimated_minutes: 30,
    deadline: '',
    startTime: '',
    importance: 50,
    difficulty: 50,
  });

  const [unavailableTimes, setUnavailableTimes] = useState<UnavailableTime[]>([
    { id: "sleep", label: "Sleep", startHour: 23, endHour: 7, days: [0, 1, 2, 3, 4, 5, 6] },
    { id: "lunch", label: "Lunch", startHour: 12, endHour: 13, days: [0, 1, 2, 3, 4, 5, 6] },
  ]);
  const [isAutoScheduleOpen, setIsAutoScheduleOpen] = useState(false);
  const [autoScheduleConfig, setAutoScheduleConfig] = useState({
    maxStudyHoursPerDay: 6,
    preferredRestTime: 30,
  });

  // State for the "Add Block" form
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [newBlock, setNewBlock] = useState<UnavailableTime>({
    id: "",
    label: "",
    startHour: 9,
    endHour: 10,
    days: [],
  });
  const [blockError, setBlockError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const weekStart = useMemo(() => {
    const start = startOfWeek(today);
    start.setDate(start.getDate() + (weekOffset * 7));
    return start;
  }, [weekOffset]);

  function prevWeek() { setWeekOffset(prev => prev - 1); }
  function nextWeek() { setWeekOffset(prev => prev + 1); }
  function resetWeek() { setWeekOffset(0); }

  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  // Month view state for calendar navigation
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthGrid = useMemo(() => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const start = startOfWeek(monthStart);
    const grid: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      grid.push(d);
    }
    return grid;
  }, [currentMonth, weekStart]);

  function prevMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  function formatMonthYear(d: Date) {
    return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  }

  // Convert an ISO date string (YYYY-MM-DD) to a local Date at midnight
  function isoToLocalDate(iso?: string | null) {
    if (!iso) return null;
    return new Date(iso + 'T00:00:00');
  }

  function toggleComplete(id: string) {
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function addNewTask() {
    setSelectedTask(null);
    setIsDialogOpen(true);
  }

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (!taskData.title?.trim()) return;

    if (taskData.id) {
      // Update existing task
      setTasks(prev => prev.map(t => t.id === taskData.id ? { ...t, ...taskData, isPinned: true } as Task : t));
    } else {
      // Add new task
      const newTaskObj: Task = {
        id: String(Date.now()),
        subject: taskData.subject || 'Math',
        title: taskData.title,
        minutes: taskData.minutes || 30,
        deadline: taskData.deadline || undefined,
        startTime: taskData.startTime || undefined,
        importance: taskData.importance || 50,
        difficulty: taskData.difficulty || 50,
        color: taskData.color || getSubjectColor(taskData.subject || 'Math'),
        notes: taskData.notes || '',
        completed: false,
        isPinned: !!taskData.startTime, // Pin if scheduled manually
      };
      setTasks(prev => [newTaskObj, ...prev]);
    }

    setIsDialogOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setIsDialogOpen(false);
    setSelectedTask(null);
  };

  const handleAddTask = async () => {
    // This function is being replaced by handleSaveTask for the modal
    // but kept for any legacy calls if any.
    handleSaveTask({ title: newTask.title, subject: newTask.subject, minutes: newTask.estimated_minutes });
  };

  const removeUnavailable = (id: string) => {
    setUnavailableTimes(s => s.filter(t => t.id !== id));
  };

  const validateAndAddBlock = () => {
    if (!newBlock.label.trim()) {
      setBlockError("Label is required.");
      return;
    }
    if (newBlock.days.length === 0) {
      setBlockError("Select at least one day.");
      return;
    }
    if (newBlock.startHour >= newBlock.endHour && !(newBlock.startHour > 12 && newBlock.endHour < 12)) {
      // Basic check, though some blocks might wrap midnight. 
      // User request says "Start time must be earlier than end time".
      if (newBlock.startHour >= newBlock.endHour) {
        setBlockError("Start time must be earlier than end time.");
        return;
      }
    }

    // Overlap check
    const hasOverlap = unavailableTimes.some(existing => {
      const sameDays = existing.days.filter(d => newBlock.days.includes(d));
      if (sameDays.length === 0) return false;

      const eStart = existing.startHour;
      const eEnd = existing.endHour;
      const nStart = newBlock.startHour;
      const nEnd = newBlock.endHour;

      // Overlap: max(start1, start2) < min(end1, end2)
      return Math.max(eStart, nStart) < Math.min(eEnd, nEnd);
    });

    if (hasOverlap) {
      setBlockError("This block overlaps with an existing unavailable time on one of the selected days.");
      return;
    }

    setUnavailableTimes(s => [...s, { ...newBlock, id: String(Date.now()) }]);
    setIsAddingBlock(false);
    setNewBlock({ id: "", label: "", startHour: 9, endHour: 10, days: [] });
    setBlockError(null);
  };

  // Auto-schedule on mount if tasks are unscheduled
  useEffect(() => {
    const hasUnscheduled = tasks.some(t => !t.completed && !t.startTime);
    if (hasUnscheduled) {
      // Small timeout to ensure state is ready
      const timer = setTimeout(() => {
        handleAutoSchedule();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []); // Run once on mount

  const handleAutoSchedule = async () => {
    setIsLoading(true);

    try {
      const payload = {
        tasks,
        unavailableTimes,
        subjectPreferences: {}, // Future: Learn from user behavior
        maxStudyHoursPerDay: autoScheduleConfig.maxStudyHoursPerDay,
        preferredRestTime: autoScheduleConfig.preferredRestTime,
        currentDate: new Date().toISOString(),
      };

      const response = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to generate schedule');

      const data = await response.json();

      // Merge scheduled tasks with existing tasks (updating start times)
      // and keep completed tasks as is.
      const newTasks = tasks.map(t => {
        if (t.completed) return t;

        // Find if this task was scheduled
        const scheduled = data.scheduledTasks.find((st: any) => st.id === t.id);
        if (scheduled) {
          return { ...t, startTime: scheduled.startTime };
        }

        // If not scheduled, but was previously scheduled, we might want to clear it?
        // Let's assume the AI provides a complete schedule for pending tasks.
        // If it's in unscheduledTasks, we can clear startTime.
        const unscheduled = data.unscheduledTasks?.find((ut: any) => ut.id === t.id);
        if (unscheduled) {
          return { ...t, startTime: undefined };
        }

        return t;
      });

      setTasks(newTasks);

      if (data.unscheduledTasks?.length > 0) {
        alert(`Could not schedule ${data.unscheduledTasks.length} tasks due to constraints.`);
      }

      setIsAutoScheduleOpen(false);
    } catch (error) {
      console.error("Auto-schedule error:", error);
      alert("Failed to generate schedule. Please check your API usage or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const [isSuggesting, setIsSuggesting] = useState(false);

  async function generateSuggestion() {
    setIsSuggesting(true);
    const withDeadline = tasks.filter((t) => t.deadline).sort((a, b) => (a.deadline! > b.deadline! ? 1 : -1));
    const tasksToSend = tasks.filter(t => !t.completed).map(t => ({
      subject: t.subject,
      title: t.title,
      deadline: t.deadline
    }));

    try {
      const response = await fetch('/api/suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: tasksToSend, // Send simplified task objects
          currentSuggestion: aiSuggestion
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch suggestion');

      const data = await response.json();
      setAiSuggestion(data.suggestion);
    } catch (error) {
      console.error(error);
      setAiSuggestion("Failed to generate AI suggestion. Try again later.");
    } finally {
      setIsSuggesting(false);
    }
  }

  const timeBySubject = tasks.reduce<Record<string, number>>((acc, t) => {
    acc[t.subject] = (acc[t.subject] || 0) + t.minutes;
    return acc;
  }, {});

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const totalMinutes = tasks.reduce((s, t) => s + t.minutes, 0);

  return (
    <main className="min-h-screen pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0b1020] text-gray-900 dark:text-gray-100">
      <FeatureHeader title="Personal Study Planner" />

      <div className="pt-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white/80 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col h-[350px]">
              <h2 className="text-lg font-semibold mb-4">Today’s Study Plan</h2>
              <div className="space-y-3 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                {tasks
                  .filter(t => t.startTime && areSameDate(new Date(t.startTime), today))
                  .sort((a, b) => (a.startTime! > b.startTime! ? 1 : -1))
                  .map((t) => (
                    <div key={t.id} onClick={() => { setSelectedTask(t); setIsDialogOpen(true); }} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-gray-100/50 dark:border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: t.color || '#4f46e5' }} />
                        <div>
                          <div className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">{t.subject} – {t.title}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {new Date(t.startTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-semibold px-2 py-1 rounded-lg bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-white/5">{t.minutes} min</div>
                    </div>
                  ))}
                {tasks.filter(t => t.startTime && areSameDate(new Date(t.startTime), today)).length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 opacity-60">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="text-sm italic">Focus on rest or add a task to your schedule!</p>
                  </div>
                )}
              </div>
            </div>

            <aside className="bg-white/80 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Calendar</h3>
                <div className="flex items-center gap-2">
                  <button onClick={prevMonth} className="px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/5">◀</button>
                  <div className="text-sm font-medium">{formatMonthYear(currentMonth)}</div>
                  <button onClick={nextMonth} className="px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/5">▶</button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center">
                {WEEK_DAYS.map((wd) => (
                  <div key={wd} className="text-xs text-gray-500">{wd}</div>
                ))}

                {monthGrid.map((d, i) => {
                  const hasDeadline = tasks.some((t) => !!t.deadline && areSameDate(isoToLocalDate(t.deadline) as Date, d));
                  const isCurrentMonth = d.getMonth() === currentMonth.getMonth();
                  const isToday = areSameDate(d, today);
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(new Date(d.getFullYear(), d.getMonth(), d.getDate()))}
                      className={`p-2 rounded-md flex flex-col items-center justify-center border ${isToday ? 'border-primary text-primary' : 'border-transparent'} hover:bg-gray-50 dark:hover:bg-white/5 ${isCurrentMonth ? '' : 'text-gray-400'}`}
                    >
                      <div className={`mt-1 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary/10' : ''}`}>{formatShort(d)}</div>
                      {hasDeadline && <div className="w-2 h-2 rounded-full bg-pink-500 mt-1" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="font-semibold">Selected:</div>
                <div className="mt-1">{selectedDate ? selectedDate.toDateString() : 'None'}</div>
              </div>

              {/* Panel showing tasks for selected date */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Tasks on selected day</h4>
                <div className="space-y-2">
                  {selectedDate ? (
                    (() => {
                      const list = tasks.filter((t) => t.deadline && areSameDate(isoToLocalDate(t.deadline) as Date, selectedDate));
                      if (list.length === 0) return <div className="text-xs italic text-gray-500">No tasks with deadlines on this day.</div>;
                      return list.map((t) => (
                        <div key={t.id} className="p-2 rounded-md bg-white/5 border border-white/5 text-sm">
                          <div className="font-medium">{t.title}</div>
                          <div className="text-xs text-gray-500">{t.subject} • {t.minutes} min</div>
                        </div>
                      ));
                    })()
                  ) : (
                    <div className="text-xs italic text-gray-500">Select a date to see tasks with deadlines.</div>
                  )}
                </div>
              </div>
            </aside>
          </section>

          <section className="bg-white/80 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col h-[350px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{showHistory ? 'Task History' : 'Study Tasks'}</h2>
              {!showHistory && (
                <button
                  onClick={addNewTask}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                  title="Add Task"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              )}
            </div>
            <div className="space-y-3 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
              {tasks
                .filter(t => showHistory ? t.completed : !t.completed)
                .map((t) => (
                  <div key={t.id} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center gap-3 group">
                    <button
                      onClick={() => toggleComplete(t.id)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${t.completed ? 'bg-primary border-primary text-white' : 'border-gray-300 dark:border-white/20 hover:border-primary'}`}
                      aria-label={t.completed ? "Mark as pending" : "Mark as completed"}
                    >
                      {t.completed && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    <div className="flex-1 min-w-0 pointer-events-none">
                      <div className={`text-sm font-bold truncate ${t.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>{t.title}</div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{t.subject} • {t.minutes}m {t.deadline && `• Due ${t.deadline}`}</div>
                    </div>
                    {!t.completed && (
                      <button
                        onClick={() => { setSelectedTask(t); setIsDialogOpen(true); }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-all"
                        title="Edit Task"
                      >
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              {tasks.filter(t => showHistory ? t.completed : !t.completed).length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60 text-center py-4">
                  <p className="text-xs italic">{showHistory ? 'No completed tasks yet.' : 'All caught up!'}</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {showHistory
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  }
                </svg>
                {showHistory ? 'Back to Pending' : 'Task History'}
              </button>
            </div>
          </section>

          <section className="bg-white/80 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Weekly Planner</h2>
                <div className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/5">
                  <button onClick={prevWeek} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all shadow-sm group" title="Previous Week">
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div className="px-3 text-xs font-bold text-gray-600 dark:text-gray-300 min-w-[120px] text-center">
                    {formatMonthYear(weekStart)} - {formatMonthYear(new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000))}
                  </div>
                  <button onClick={nextWeek} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all shadow-sm group" title="Next Week">
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                {weekOffset !== 0 && (
                  <button onClick={resetWeek} className="text-[10px] font-bold text-primary hover:underline">Today</button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAutoScheduleOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  AI Auto-Schedule
                </button>
                <div className="text-xs text-gray-500">Drag to reschedule</div>
              </div>
            </div>

            <WeeklySchedule
              tasks={tasks.filter(t => !t.completed)}
              currentDate={weekOffset === 0 && selectedDate ? selectedDate : weekStart}
              unavailableTimes={unavailableTimes}
              preferredRestTime={autoScheduleConfig.preferredRestTime}
              onSlotClick={(date) => {
                setSelectedTask({
                  id: "",
                  subject: "Math",
                  title: "",
                  minutes: 30,
                  startTime: date.toISOString(),
                  deadline: date.toISOString().slice(0, 10),
                  color: getSubjectColor("Math"),
                });
                setIsDialogOpen(true);
              }}
              onTaskClick={(t) => {
                setSelectedTask(t);
                setIsDialogOpen(true);
              }}
              onTaskChange={(t) => {
                setTasks(s => s.map(x => x.id === t.id ? { ...t, isPinned: true } : x));
              }}
            />
          </section>

          <section className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">AI Study Suggestions</h2>
            <div className="max-w-3xl mx-auto p-4 rounded-md bg-white dark:bg-[#061022] border border-gray-100 dark:border-white/5 text-left">
              <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{aiSuggestion}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={generateSuggestion}
                disabled={isSuggesting}
                className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 transition-opacity"
              >
                {isSuggesting ? 'Thinking...' : 'Generate / Update Plan'}
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Time by Subject</h3>
              <div className="space-y-3">
                {Object.entries(timeBySubject).map(([sub, mins]) => (
                  <div key={sub} className="flex items-center gap-4">
                    <div className="w-24 text-sm">{sub}</div>
                    <div className="flex-1 h-3 bg-white/10 rounded overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${Math.min(100, (mins / Math.max(1, totalMinutes)) * 100)}%` }} aria-label={`${sub} percentage`} />
                    </div>
                    <div className="w-16 text-right text-sm">{mins}m</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Weekly Overview</h3>
              <div className="text-sm text-gray-700 dark:text-gray-200 space-y-2">
                <div>Total study hours this week: {(totalMinutes / 60).toFixed(1)} hrs</div>
                <div>Completed tasks: {completedCount}</div>
                <div>Pending tasks: {pendingCount}</div>
                <div className="mt-3 italic text-xs text-gray-500 dark:text-gray-400">You complete English tasks faster than Math tasks.</div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {isAutoScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsAutoScheduleOpen(false)} />
          <div className="relative bg-white dark:bg-[#071024] rounded-xl p-6 w-full max-w-lg shadow-xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-xl">✨</span> AI Auto-Scheduler
              </h3>
              <button onClick={() => setIsAutoScheduleOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label="Close Auto-Scheduler">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Unavailable Time Blocks</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                  {unavailableTimes.map(ut => (
                    <div key={ut.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 group">
                      <div>
                        <div className="text-sm font-semibold">{ut.label}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-tighter">
                          {ut.startHour}:00 - {ut.endHour}:00 • {ut.days.map(d => WEEK_DAYS[d]).join(', ')}
                        </div>
                      </div>
                      <button
                        onClick={() => removeUnavailable(ut.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        title="Remove Block"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                  {unavailableTimes.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-lg text-xs text-gray-500">
                      No unavailable blocks set.
                    </div>
                  )}
                </div>

                {!isAddingBlock ? (
                  <button
                    onClick={() => setIsAddingBlock(true)}
                    className="w-full mt-3 py-2 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium text-gray-500 hover:text-primary hover:border-primary transition-all"
                  >
                    + Add Block (Class, Work, Gym, etc.)
                  </button>
                ) : (
                  <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold uppercase text-primary/70">Block Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Morning Classes"
                          value={newBlock.label}
                          onChange={e => setNewBlock(s => ({ ...s, label: e.target.value }))}
                          className="w-full mt-1 p-2 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0b1a2b] text-sm"
                          aria-label="Block Title"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-primary/70">Start (24h)</label>
                        <input
                          type="number" min="0" max="23"
                          value={newBlock.startHour}
                          onChange={e => setNewBlock(s => ({ ...s, startHour: Number(e.target.value) }))}
                          className="w-full mt-1 p-2 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0b1a2b] text-sm"
                          aria-label="Start Hour"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-primary/70">End (24h)</label>
                        <input
                          type="number" min="0" max="23"
                          value={newBlock.endHour}
                          onChange={e => setNewBlock(s => ({ ...s, endHour: Number(e.target.value) }))}
                          className="w-full mt-1 p-2 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0b1a2b] text-sm"
                          aria-label="End Hour"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-primary/70 mb-2 block">Day Selection</label>
                      <div className="flex flex-wrap gap-1">
                        {WEEK_DAYS.map((day, idx) => (
                          <button
                            key={day}
                            onClick={() => setNewBlock(s => ({
                              ...s,
                              days: s.days.includes(idx) ? s.days.filter(d => d !== idx) : [...s.days, idx]
                            }))}
                            className={`px-2 py-1.5 rounded-md text-[10px] font-bold transition-colors ${newBlock.days.includes(idx) ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    {blockError && (
                      <div className="text-[10px] text-red-500 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                        ⚠️ {blockError}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button onClick={() => { setIsAddingBlock(false); setBlockError(null); }} className="flex-1 py-2 text-xs font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">Cancel</button>
                      <button onClick={validateAndAddBlock} className="flex-1 py-2 text-xs font-medium bg-primary text-white rounded-lg shadow-lg shadow-primary/20">Save Block</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 dark:border-white/5 pt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Study Hours / Day</label>
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="range" min="1" max="16" step="0.5"
                      value={autoScheduleConfig.maxStudyHoursPerDay}
                      onChange={(e) => setAutoScheduleConfig(s => ({ ...s, maxStudyHoursPerDay: Number(e.target.value) }))}
                      className="flex-1"
                      aria-label="Max Study Hours Per Day"
                    />
                    <div className="text-sm font-bold text-primary">{autoScheduleConfig.maxStudyHoursPerDay}h</div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">The AI will distribute your tasks without exceeding this limit.</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Rest Time (minutes)</label>
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="number" min="0" max="120" step="5"
                      value={autoScheduleConfig.preferredRestTime}
                      onChange={(e) => setAutoScheduleConfig(s => ({ ...s, preferredRestTime: Number(e.target.value) }))}
                      className="w-full mt-1 p-2 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0b1a2b] text-sm"
                      aria-label="Preferred Rest Time"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">The AI will insert this mandatory buffer between study blocks.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-8">
              <button
                onClick={() => setIsAutoScheduleOpen(false)}
                className="px-6 py-2.5 text-sm font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAutoSchedule}
                disabled={isLoading || isAddingBlock}
                className="px-8 py-2.5 text-sm font-bold bg-primary text-white rounded-xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? 'Optimizing...' : 'Generate Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      <TaskModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        initialTask={selectedTask}
        getSubjectColor={getSubjectColor}
      />

      <footer className="text-center text-xs text-gray-500 dark:text-gray-400 py-6">
        Designed for focused study • <button onClick={() => setDark((d) => !d)} className="underline">Toggle dark mode</button>
      </footer>
    </main>
  );
}

// Helpers
function addDaysISO(d: Date, days: number) {
  const n = new Date(d);
  n.setDate(n.getDate() + days);
  return n.toISOString().slice(0, 10);
}

function startOfWeek(d: Date) {
  const n = new Date(d);
  const day = (n.getDay() + 6) % 7;
  n.setDate(n.getDate() - day);
  n.setHours(0, 0, 0, 0);
  return n;
}

function areSameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function diffDaysISO(iso: string, from: Date) {
  const d = new Date(iso + "T00:00:00");
  const diff = Math.ceil((d.getTime() - new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

// Derived values used in render

