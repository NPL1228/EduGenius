
"use client";

import FeatureHeader from '@/components/FeatureHeader';
import WeeklySchedule from '@/components/WeeklySchedule';
import { useEffect, useMemo, useState } from "react";

export type Task = {
  id: string;
  subject: string;
  title: string;
  minutes: number;
  deadline?: string;
  completed?: boolean;
  startTime?: string; // ISO string for the start time
};

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
    { id: "1", subject: "Math", title: "Integration Practice", minutes: 45, startTime: getTodayAt(10) },
    { id: "2", subject: "CS", title: "BFS Revision", minutes: 30, deadline: addDaysISO(today, 1), startTime: getTodayAt(14) },
    { id: "3", subject: "Physics", title: "Chapter 3 Notes", minutes: 60 },
    { id: "4", subject: "English", title: "Essay Draft", minutes: 45, deadline: addDaysISO(today, 3) },
  ]);

  const [viewMode, setViewMode] = useState<'list' | 'week'>('list');

  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [aiSuggestion, setAiSuggestion] = useState<string>(
    "You have a Physics quiz in 2 days. Consider prioritising Physics tonight and moving English to tomorrow."
  );
  const [dark, setDark] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newTask, setNewTask] = useState<{ subject: string; title: string; estimated_minutes: number; deadline: string; startTime: string; importance: number; difficulty: number }>({
    subject: 'Math',
    title: '',
    estimated_minutes: 30,
    deadline: '',
    startTime: '',
    importance: 50,
    difficulty: 50,
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const weekStart = startOfWeek(today);

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
    // Open modal/dialog to add task
    setIsDialogOpen(true);
  }

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    setIsLoading(true);
    try {
      // If a real API exists on window, use it; otherwise fallback to local state
      const payload = {
        subject: newTask.subject,
        title: newTask.title,
        estimated_minutes: newTask.estimated_minutes,
        deadline: newTask.deadline || null,
        startTime: newTask.startTime || undefined,
        completed: false,
      };

      if ((window as any).taskApi?.createTask) {
        await (window as any).taskApi.createTask(payload);
        // In a real app you'd refresh from server here (onTasksChange or fetch)
        setTasks((s) => [
          {
            id: String(Date.now()),
            subject: payload.subject,
            title: payload.title,
            minutes: payload.estimated_minutes,
            deadline: payload.deadline || undefined,
          },
          ...s,
        ]);
      } else {
        // Local fallback
        setTasks((s) => [
          {
            id: String(Date.now()),
            subject: payload.subject,
            title: payload.title,
            minutes: payload.estimated_minutes,
            deadline: payload.deadline || undefined,
          },
          ...s,
        ]);
      }

      // Reset form and close dialog
      setNewTask({ subject: 'Math', title: '', estimated_minutes: 30, deadline: '', startTime: '', importance: 50, difficulty: 50 });
      setIsDialogOpen(false);
      // onTasksChange placeholder: in a real app call parent refresh
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  function generateSuggestion() {
    const withDeadline = tasks.filter((t) => t.deadline).sort((a, b) => (a.deadline! > b.deadline! ? 1 : -1));
    if (withDeadline.length === 0) {
      setAiSuggestion("No upcoming deadlines detected. Balance tasks by estimated time.");
      return;
    }
    const soon = withDeadline[0];
    const daysLeft = diffDaysISO(soon.deadline!, today);
    setAiSuggestion(`You have ${soon.subject} – ${soon.title} due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}. Consider prioritising it tonight.`);
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
            <div className="lg:col-span-2 bg-white/80 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Today’s Study Plan</h2>
              <div className="space-y-3">
                {tasks.slice(0, 4).map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                    <div>
                      <div className="font-semibold">{t.subject} – {t.title}</div>
                      {t.deadline && <div className="text-xs text-gray-500">Deadline: {t.deadline}</div>}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{t.minutes} min</div>
                  </div>
                ))}
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

          <section className="bg-white/80 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Study Tasks</h2>
              <div className="flex items-center bg-gray-100 dark:bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-white/10 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${viewMode === 'week' ? 'bg-white dark:bg-white/10 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  Week
                </button>
              </div>
            </div>

            {viewMode === 'week' ? (
              <WeeklySchedule
                tasks={tasks}
                currentDate={selectedDate || new Date()}
                onSlotClick={(date) => {
                  setNewTask(prev => ({
                    ...prev,
                    startTime: date.toISOString(), // Pre-fill start time
                    deadline: date.toISOString().slice(0, 10) // Pre-fill deadline as same day
                  }));
                  setIsDialogOpen(true);
                }}
                onTaskClick={(t) => {
                  alert(`Clicked task: ${t.title}`);
                }}
              />
            ) : (
              <>
                <div className="space-y-2">
                  {(selectedDate ? tasks.filter((t) => t.deadline === selectedDate.toISOString().slice(0, 10)) : tasks).map((t) => (
                    <div key={t.id} className={`flex items-center justify-between p-3 rounded-lg ${t.deadline ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400/40' : 'bg-gray-50 dark:bg-white/5'}`}>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={!!t.completed} onChange={() => toggleComplete(t.id)} className="w-4 h-4" />
                        <div className="text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/30">{t.subject}</div>
                        <div>
                          <div className="font-medium">{t.title}</div>
                          {t.deadline && <div className="text-xs text-gray-500">Deadline: {t.deadline}</div>}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{Math.round(t.minutes / 60) ? `${Math.round(t.minutes / 60)} hr` : `${t.minutes} min`}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <button onClick={addNewTask} className="px-4 py-2 bg-primary text-white rounded-lg">+ Add New Task</button>
                </div>
              </>
            )}
          </section>

          <section className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">AI Study Suggestions</h2>
            <div className="max-w-3xl mx-auto p-4 rounded-md bg-white dark:bg-[#061022] border border-gray-100 dark:border-white/5 text-left">
              <p className="text-sm text-gray-700 dark:text-gray-200">{aiSuggestion}</p>
            </div>
            <div className="mt-4">
              <button onClick={generateSuggestion} className="px-4 py-2 bg-primary text-white rounded-lg">Generate / Update Plan</button>
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
                      <div className="h-full bg-primary" style={{ width: `${Math.min(100, (mins / Math.max(1, totalMinutes)) * 100)}%` }} />
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

          {isDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => !isLoading && setIsDialogOpen(false)} />
              <div className="relative bg-white dark:bg-[#071024] rounded-xl p-6 w-full max-w-md shadow-xl z-10">
                <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500">Subject</label>
                    <input value={newTask.subject} onChange={(e) => setNewTask(s => ({ ...s, subject: e.target.value }))} className="w-full mt-1 p-2 rounded-md border bg-white text-gray-900 dark:bg-[#071a2a] dark:text-gray-100 border-gray-200 dark:border-white/10" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Title</label>
                    <input value={newTask.title} onChange={(e) => setNewTask(s => ({ ...s, title: e.target.value }))} className="w-full mt-1 p-2 rounded-md border bg-white text-gray-900 dark:bg-[#071a2a] dark:text-gray-100 border-gray-200 dark:border-white/10" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Estimated minutes</label>
                      <input type="number" value={newTask.estimated_minutes} onChange={(e) => setNewTask(s => ({ ...s, estimated_minutes: Number(e.target.value) }))} className="w-full mt-1 p-2 rounded-md border bg-white text-gray-900 dark:bg-[#071a2a] dark:text-gray-100 border-gray-200 dark:border-white/10" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Deadline</label>
                      <input type="date" value={newTask.deadline} onChange={(e) => setNewTask(s => ({ ...s, deadline: e.target.value }))} className="w-full mt-1 p-2 rounded-md border bg-white text-gray-900 dark:bg-[#071a2a] dark:text-gray-100 border-gray-200 dark:border-white/10" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500">Subject importance: <span className="font-medium">{newTask.importance}</span></label>
                      <input aria-label="importance" type="range" min={0} max={100} value={newTask.importance} onChange={(e) => setNewTask(s => ({ ...s, importance: Number(e.target.value) }))} className="w-full mt-1" />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500">Difficulty level: <span className="font-medium">{newTask.difficulty}</span></label>
                      <input aria-label="difficulty" type="range" min={0} max={100} value={newTask.difficulty} onChange={(e) => setNewTask(s => ({ ...s, difficulty: Number(e.target.value) }))} className="w-full mt-1" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setIsDialogOpen(false)} disabled={isLoading} className="px-4 py-2 rounded-md border">Cancel</button>
                    <button onClick={handleAddTask} disabled={isLoading} className="px-4 py-2 bg-primary text-white rounded-md">{isLoading ? 'Adding…' : 'Add Task'}</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <footer className="text-center text-xs text-gray-500 dark:text-gray-400 py-6">
            Designed for focused study • <button onClick={() => setDark((d) => !d)} className="underline">Toggle dark mode</button>
          </footer>
        </div>
      </div>
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

