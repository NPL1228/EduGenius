import { useRef, useState, useEffect } from "react";

type SavedNote = {
    id: string;
    createdAt: string;
    content: string;
};

export function useRecorder() {
    const [status, setStatus] = useState<"idle" | "recording" | "processing">("idle");
    const [volume, setVolume] = useState(0);
    const [realTimeText, setRealTimeText] = useState("");
    const [notes, setNotes] = useState<SavedNote[]>([]);
    const [hydrated, setHydrated] = useState(false); // 👈 IMPORTANT

    const fullTranscriptRef = useRef("");
    const recognitionRef = useRef<any>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const rafRef = useRef<number | null>(null);

    // ✅ Load notes ONCE
    useEffect(() => {
        const savedNotes = localStorage.getItem("lecture_notes_history");
        if (savedNotes) {
            try {
                setNotes(JSON.parse(savedNotes));
            } catch (e) {
                console.error("Failed to parse saved notes", e);
            }
        }
        setHydrated(true); // 👈 mark as ready
    }, []);

    // ✅ Save ONLY after hydration
    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem("lecture_notes_history", JSON.stringify(notes));
    }, [notes, hydrated]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const audioCtx = new AudioContext();
            audioCtxRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 512;
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateVolume = () => {
                analyser.getByteFrequencyData(dataArray);
                const avg =
                    dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length;
                setVolume(Math.min(avg, 100));
                rafRef.current = requestAnimationFrame(updateVolume);
            };

            updateVolume();

            const SpeechRecognition =
                (window as any).SpeechRecognition ||
                (window as any).webkitSpeechRecognition;

            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US";

            recognition.onresult = (event: any) => {
                let interim = "";
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const text = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        fullTranscriptRef.current += text + " ";
                    } else {
                        interim = text;
                    }
                }
                setRealTimeText(fullTranscriptRef.current + interim);
            };

            recognition.start();
            recognitionRef.current = recognition;
            setStatus("recording");
        } catch {
            alert("Mic access denied");
        }
    };

    const stopRecording = async (userInstruction: string) => {
        setStatus("processing");

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (audioCtxRef.current) await audioCtxRef.current.close();
        setVolume(0);
        recognitionRef.current?.stop();

        const transcript = fullTranscriptRef.current.trim();
        if (transcript.split(/\s+/).length < 20) {
            alert("Transcript too short. Note not saved.");
            fullTranscriptRef.current = "";
            setRealTimeText("");
            setStatus("idle");
            return;
        }

        try {
            const res = await fetch("/api/gemini/StudyHelper", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript, prompt: userInstruction }),
            });

            const data = await res.json();

            const now = new Date();
            const noteId = crypto?.randomUUID?.() ?? Math.random().toString(36) + Date.now().toString(36);

            setNotes(prev => [
                ...prev,
                {
                    id: noteId,
                    content: data.message || "No content",
                    createdAt: now.toISOString(),
                    createdAtReadable: now.toLocaleString(), // 👈 human-readable timestamp
                }
            ]);
        } catch (err) {
            console.error("Failed to generate note:", err);
        }

        fullTranscriptRef.current = "";
        setRealTimeText("");
        setStatus("idle");
    };

    const deleteNote = (id: string) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    };

    return {
        status,
        volume,
        realTimeText,
        notes,
        startRecording,
        stopRecording,
        deleteNote,
    };
}
