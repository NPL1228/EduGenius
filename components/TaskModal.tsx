import React, { useState, useEffect } from 'react';
import { Task } from '@/app/planner/page';

type TaskModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Partial<Task>) => void;
    onDelete?: (id: string) => void;
    initialTask?: Task | null;
    getSubjectColor: (subject: string) => string;
};

export default function TaskModal({ isOpen, onClose, onSave, onDelete, initialTask, getSubjectColor }: TaskModalProps) {
    const [task, setTask] = useState<Partial<Task>>({
        subject: 'Math',
        title: '',
        minutes: 30,
        deadline: '',
        importance: 50,
        difficulty: 50,
        notes: '',
        color: '#3b82f6',
    });

    useEffect(() => {
        if (initialTask) {
            setTask(initialTask);
        } else {
            setTask({
                subject: 'Math',
                title: '',
                minutes: 30,
                deadline: '',
                importance: 50,
                difficulty: 50,
                notes: '',
                color: getSubjectColor('Math'),
            });
        }
    }, [initialTask, isOpen, getSubjectColor]);

    if (!isOpen) return null;

    const handleSubjectChange = (subject: string) => {
        setTask(prev => ({
            ...prev,
            subject,
            color: prev.color === getSubjectColor(prev.subject || '') ? getSubjectColor(subject) : prev.color
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-[#071024] rounded-2xl p-6 w-full max-w-lg shadow-2xl z-10 max-h-[90vh] overflow-y-auto border border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {initialTask ? 'Edit Study Task' : 'Add New Task'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors" aria-label="Close modal">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="modal-subject" className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Subject</label>
                            <input
                                id="modal-subject"
                                value={task.subject}
                                onChange={(e) => handleSubjectChange(e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0b1a2b] text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="modal-title" className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Title</label>
                            <input
                                id="modal-title"
                                value={task.title}
                                onChange={(e) => setTask(s => ({ ...s, title: e.target.value }))}
                                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0b1a2b] text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="modal-duration" className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Duration (min)</label>
                            <input
                                id="modal-duration"
                                type="number"
                                value={task.minutes}
                                onChange={(e) => setTask(s => ({ ...s, minutes: Number(e.target.value) }))}
                                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0b1a2b] text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="modal-deadline" className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Deadline</label>
                            <input
                                id="modal-deadline"
                                type="date"
                                value={task.deadline || ''}
                                onChange={(e) => setTask(s => ({ ...s, deadline: e.target.value }))}
                                className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0b1a2b] text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="modal-importance" className="text-[10px] font-bold uppercase text-gray-500">Importance</label>
                                    <span className="text-xs font-bold text-primary">{task.importance}</span>
                                </div>
                                <input id="modal-importance" type="range" min={0} max={100} value={task.importance} onChange={(e) => setTask(s => ({ ...s, importance: Number(e.target.value) }))} className="w-full accent-primary" />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="modal-difficulty" className="text-[10px] font-bold uppercase text-gray-500">Difficulty</label>
                                    <span className="text-xs font-bold text-violet-500">{task.difficulty}</span>
                                </div>
                                <input id="modal-difficulty" type="range" min={0} max={100} value={task.difficulty} onChange={(e) => setTask(s => ({ ...s, difficulty: Number(e.target.value) }))} className="w-full accent-violet-500" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="modal-color" className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Custom Color</label>
                            <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-[#0b1a2b] border border-gray-200 dark:border-white/10">
                                <input
                                    id="modal-color"
                                    type="color"
                                    value={task.color}
                                    onChange={(e) => setTask(s => ({ ...s, color: e.target.value }))}
                                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                                    aria-label="Pick color"
                                />
                                <span className="text-xs font-mono text-gray-400 capitalize">{task.color}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="modal-notes" className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Notes</label>
                        <textarea
                            id="modal-notes"
                            value={task.notes || ''}
                            onChange={(e) => setTask(s => ({ ...s, notes: e.target.value }))}
                            rows={3}
                            placeholder="Add resources, key topics, or reminders..."
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0b1a2b] text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        {initialTask && onDelete && (
                            <button
                                onClick={() => onDelete(initialTask.id)}
                                className="px-4 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                            >
                                Delete
                            </button>
                        )}
                        <div className="flex-1 flex gap-3">
                            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm font-medium border border-gray-200 dark:border-white/10">
                                Cancel
                            </button>
                            <button
                                onClick={() => onSave(task)}
                                className="flex-[2] px-4 py-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity text-sm font-bold"
                            >
                                {initialTask ? 'Update Task' : 'Create Task'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
