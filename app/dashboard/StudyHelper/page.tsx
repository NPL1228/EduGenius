"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { NoteDisplay } from "@/components/LectureMode/NoteDisplay";
import { useRecorder } from "@/components/LectureMode/useRecorder";

export default function StudyHelperPage() {
    const { status, volume, notes, startRecording, stopRecording, realTimeText, deleteNote } = useRecorder();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Refs for scrolling
    const transBoxRef = useRef<HTMLDivElement>(null);
    const notesRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    // Auto-scroll Live Transcription to bottom
    useEffect(() => {
        if (transBoxRef.current) {
            transBoxRef.current.scrollTop = transBoxRef.current.scrollHeight;
        }
    }, [realTimeText]);

    // Scroll center note into view when history item is clicked
    const scrollToNote = (index: number) => {
        setActiveIndex(index);
        notesRefs.current[index]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 w-full mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="gradient-text">Lecture Helper</span>
                    </h1>
                    <p className="text-gray-400">
                        Record lectures and generate AI-powered summaries in real-time.
                    </p>
                </div>
                <Link
                    href="/dashboard/notes"
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold rounded-2xl transition shadow-lg whitespace-nowrap"
                >
                    Summarise Mode
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* LEFT SIDE */}
                <aside className="w-full lg:w-[350px] lg:sticky lg:top-28 flex flex-col gap-4">
                    <div className="glass-card p-6 flex flex-col items-center gap-6 w-full">
                        <h2 className="text-xl font-semibold border-b border-white/10 w-full pb-2 text-center">
                            Lecture Control
                        </h2>

                        {status === "idle" && (
                            <button
                                onClick={startRecording}
                                className="gradient-primary w-full py-4 rounded-2xl font-semibold shadow-lg hover:opacity-90 transition"
                            >
                                Start Recording
                            </button>
                        )}

                        {status === "recording" && (
                            <button
                                onClick={() =>
                                    stopRecording("Please summarize this lecture in detail.")
                                }
                                className="bg-red-500 hover:bg-red-600 w-full py-4 rounded-2xl font-semibold shadow-lg transition"
                            >
                                Stop & Generate
                            </button>
                        )}

                        {status === "processing" && (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-gray-400 text-sm">AI Processing...</p>
                            </div>
                        )}

                        {status === "recording" && (
                            <div className="w-full">
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 transition-all duration-100"
                                        style={{ width: `${volume}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Live Transcription */}
                    {status === "recording" && (
                        <div className="w-full bg-white/5 border border-primary/20 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                            <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    Live Stream
                                </h3>
                            </div>

                            <div
                                ref={transBoxRef}
                                className="h-64 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 bg-black/20"
                            >
                                <p className="text-gray-300 italic text-base leading-relaxed">
                                    {realTimeText || (
                                        <span className="text-gray-600 animate-pulse text-sm">
                                            Waiting for audio input...
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Note History */}
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mt-4 mb-2 ml-2">
                        Note History
                    </h2>
                    <div className="glass-card p-4 space-y-3 max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                        {notes.length > 0 ? (
                            [...notes].reverse().map((note, idx) => {
                                const originalIndex = notes.length - 1 - idx;
                                return (
                                    <div key={note.id} className="flex justify-between items-center w-full">
                                        <button
                                            key={note.id}
                                            onClick={() => scrollToNote(originalIndex)}
                                            className={`w-full text-left p-3 rounded-xl border transition-all text-sm ${activeIndex === originalIndex
                                                ? "bg-primary/20 border-primary text-primary"
                                                : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                                                }`}
                                        >
                                            <div className="font-bold truncate">
                                                Lecture Note #{originalIndex + 1}
                                            </div>
                                            <div className="text-[10px] opacity-50 truncate mt-1">
                                                {note?.content ? note.content.substring(0, 35) : "No content"}...
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => deleteNote(note.id)}
                                            className="ml-2 text-red-500 hover:text-red-600 text-sm px-2 py-1 rounded-md border border-red-500 hover:border-red-600 transition"
                                        >
                                            Delete
                                        </button>

                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-xs text-center text-gray-600 py-4 italic">
                                No notes in history
                            </p>
                        )}
                    </div>
                </aside>

                {/* RIGHT SIDE */}
                <section className="flex-1 w-full h-[calc(100vh-8rem)] overflow-y-auto pr-2">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 ml-2">
                        Generated Notes
                    </h2>
                    <div className="flex flex-col gap-6 px-2">
                        {notes.length > 0 ? (
                            notes.map((note, idx) => (
                                <div
                                    key={note.id}
                                    ref={(el) => {
                                        notesRefs.current[idx] = el;
                                    }}
                                    className={`transition-all duration-300 ${activeIndex === idx ? "scale-[1.01] brightness-110" : ""
                                        }`}
                                >
                                    <NoteDisplay content={note.content} />
                                </div>
                            ))
                        ) : (
                            <div className="glass-card p-20 flex flex-col items-center justify-center border-dashed border-2 border-white/5">
                                <p className="text-center text-gray-600 italic">
                                    Your AI-generated lecture notes will appear here once you stop
                                    recording.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
