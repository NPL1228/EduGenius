import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        const prompt = `Analyze the following message and provide two things:
1. A category (one of: Math, Science, Languages, History, Others)
2. A short, concise title (max 5-6 words) for a chat starting with this message.

Respond ONLY with a valid JSON object in this format:
{
  "category": "CategoryName",
  "title": "Your Title Here"
}

Message: "${message}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        let jsonResponse;
        try {
            // Clean up markdown code blocks if present
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            jsonResponse = JSON.parse(cleanText);
        } catch (e) {
            console.error('Failed to parse JSON response:', text);
            // Fallback
            jsonResponse = {
                category: 'Others',
                title: message.substring(0, 30) + (message.length > 30 ? '...' : '')
            };
        }

        // Validate category
        const validCategories = ['Math', 'Science', 'Languages', 'History', 'Others'];
        const finalCategory = validCategories.includes(jsonResponse.category) ? jsonResponse.category : 'Others';

        return NextResponse.json({
            category: finalCategory,
            title: jsonResponse.title
        });
    } catch (error) {
        console.error('Error categorizing message:', error);
        return NextResponse.json(
            { error: 'Failed to categorize message', category: 'Others', title: 'New Chat' },
            { status: 500 }
        );
    }
}
