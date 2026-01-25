import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Analyze the following message and categorize it into ONE of these subjects: Math, Science, Languages, History, or Others.
Only respond with the exact category name, nothing else.

Message: "${message}"

Category:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const category = response.text().trim();

        // Validate category
        const validCategories = ['Math', 'Science', 'Languages', 'History', 'Others'];
        const finalCategory = validCategories.includes(category) ? category : 'Others';

        return NextResponse.json({ category: finalCategory });
    } catch (error) {
        console.error('Error categorizing message:', error);
        return NextResponse.json(
            { error: 'Failed to categorize message', category: 'Others' },
            { status: 500 }
        );
    }
}
