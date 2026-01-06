export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export interface ChatResponse {
    message: string;
    error?: string;
}
