export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    imageUrl?: string; // For displaying uploaded images
    imageData?: string; // Base64 image data for API
    mimeType?: string; // MIME type of the image
}

export interface ChatResponse {
    message: string;
    error?: string;
}
