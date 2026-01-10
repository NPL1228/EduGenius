import React, { useRef } from 'react';

interface ImageUploaderProps {
    onImageSelect: (imageData: string, mimeType: string, imageUrl: string) => void;
    selectedImageUrl: string | null;
    onClearImage: () => void;
}

export default function ImageUploader({ onImageSelect, selectedImageUrl, onClearImage }: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 4MB)
        if (file.size > 4 * 1024 * 1024) {
            alert('Image size must be less than 4MB');
            return;
        }

        // Create preview URL
        const imageUrl = URL.createObjectURL(file);

        // Convert to base64
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result?.toString().replace(/^data:(.*,)?/, '') || '';
            onImageSelect(base64, file.type, imageUrl);
        };
        reader.onerror = () => {
            alert('Failed to read image file');
        };
        reader.readAsDataURL(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClearImage();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="relative">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {selectedImageUrl ? (
                <div className="relative inline-block">
                    <img
                        src={selectedImageUrl}
                        alt="Selected question"
                        className="max-h-20 rounded-lg border border-purple-400/50"
                    />
                    <button
                        onClick={handleClear}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
                        title="Remove image"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleClick}
                    className="glass border border-white/10 rounded-lg px-4 py-2 hover:border-purple-400/50 transition-all flex items-center gap-2 text-gray-300 hover:text-white"
                    title="Upload question image"
                >
                    <span className="text-xl">📸</span>
                    <span className="text-sm">Upload Image</span>
                </button>
            )}
        </div>
    );
}
