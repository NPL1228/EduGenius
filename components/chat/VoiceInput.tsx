import React, { useState, useEffect, useRef } from 'react';

interface VoiceInputProps {
    onTranscript: (text: string) => void;
}

export default function VoiceInput({ onTranscript }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check for browser support
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onTranscript(transcript);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
                alert('Microphone access denied. Please allow microphone access to use voice input.');
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, [onTranscript]);

    const toggleListening = () => {
        if (!isSupported) {
            alert('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    return (
        <button
            onClick={toggleListening}
            disabled={!isSupported}
            className={`glass border rounded-lg px-4 py-2 transition-all flex items-center gap-2 ${isListening
                    ? 'border-red-400 bg-red-500/20 text-red-400 animate-pulse'
                    : 'border-white/10 hover:border-purple-400/50 text-gray-300 hover:text-white'
                } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isListening ? 'Stop recording' : 'Start voice input'}
        >
            <span className="text-xl">{isListening ? '⏹️' : '🎤'}</span>
            <span className="text-sm">
                {isListening ? 'Listening...' : 'Voice'}
            </span>
        </button>
    );
}
