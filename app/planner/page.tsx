
"use client";

import { useEffect, useMemo, useState } from "react";

type Task = {
  id: string;
  subject: string;
  title: string;
  minutes: number;
  deadline?: string;
  completed?: boolean;
};

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function formatShort(date: Date) {
  return date.getDate();
}

export default function PlannerPage() {
  const today = new Date();
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", subject: "Math", title: "Integration Practice", minutes: 45 },
    { id: "2", subject: "CS", title: "BFS Revision", minutes: 30, deadline: addDaysISO(today, 1) },
    { id: "3", subject: "Physics", title: "Chapter 3 Notes", minutes: 60 },
    { id: "4", subject: "English", title: "Essay Draft", minutes: 45, deadline: addDaysISO(today, 3) },
  ]);

  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [aiSuggestion, setAiSuggestion] = useState<string>(
    "You have a Physics quiz in 2 days. Consider prioritising Physics tonight and moving English to tomorrow."
  );
  const [dark, setDark] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newTask, setNewTask] = useState<{ subject: string; title: string; estimated_minutes: number; deadline: string }>({
    subject: 'Math',
    title: '',
    estimated_minutes: 30,
    deadline: '',
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
      setNewTask({ subject: 'Math', title: '', estimated_minutes: 30, deadline: '' });
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
      <header className="max-w-6xl mx-auto flex items-center justify-between py-6">
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold">Personal Study Planner</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Plan smarter. Study with clarity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button title="Toggle dark" onClick={() => setDark((d) => !d)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5">
            {dark ? "🌙" : "☀️"}
          </button>
          <div className="w-8 h-8 bg-gray-200 dark:bg-white/5 rounded-full flex items-center justify-center text-sm">JD</div>
          <button title="Settings" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5">⚙</button>
        </div>
      </header>

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
            <h3 className="text-sm font-semibold mb-3">This Week</h3>
            <div className="grid grid-cols-7 gap-2">
              {days.map((d, i) => {
                const iso = d.toISOString().slice(0, 10);
                const hasDeadline = tasks.some((t) => t.deadline === iso);
                const isToday = areSameDate(d, today);
                return (
                  <button key={i} onClick={() => setSelectedDayOffset(i)} className={`p-2 rounded-md flex flex-col items-center justify-center border ${isToday ? 'border-primary text-primary' : 'border-transparent'} hover:bg-gray-50 dark:hover:bg-white/5`}>
                    <div className="text-xs">{WEEK_DAYS[i]}</div>
                    <div className={`mt-1 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary/10' : ''}`}>{formatShort(d)}</div>
                    {hasDeadline && <div className="w-2 h-2 rounded-full bg-pink-500 mt-1" />}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="font-semibold">Selected:</div>
              <div className="mt-1">{days[selectedDayOffset].toDateString()}</div>
              <div className="mt-2 text-xs text-gray-500">Click a day to view tasks (conceptual expansion)</div>
            </div>
          </aside>
        </section>

        <section className="bg-white/80 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Study Tasks</h2>
            <div className="text-sm text-gray-500">{tasks.length} tasks</div>
          </div>
          <div className="space-y-2">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={!!t.completed} onChange={() => toggleComplete(t.id)} className="w-4 h-4" />
                  <div className="text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/30">{t.subject}</div>
                  <div>{t.title}</div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{Math.round(t.minutes/60) ? `${Math.round(t.minutes/60)} hr` : `${t.minutes} min`}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button onClick={addNewTask} className="px-4 py-2 bg-primary text-white rounded-lg">+ Add New Task</button>
          </div>
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
              <div>Total study hours this week: {(totalMinutes/60).toFixed(1)} hrs</div>
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
 
