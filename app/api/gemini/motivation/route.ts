import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const { streak, activity } = await req.json();

        // Validate or fallback for stats
        const currentStreak = streak || 0;
        const chats = activity?.chats || 0;
        const notes = activity?.notes || 0;

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `
        You are a data-driven study coach. Generate a single, short, non-cringe motivational sentence based on this user's data:
        - Current Streak: ${currentStreak} days
        - Recent Chats: ${chats}
        - Recent Notes: ${notes}

        Rules:
        1. NO clichés (e.g., "Review your goals", "You can do it").
        2. Reference the specific data points to prove you are paying attention.
        3. If streak is 0, focus on starting freshly.
        4. If streak is high (>3), praise consistency.
        5. Tone: Casual, observational, slightly witty but supportive.
        6. Max 15 words.
        
        Examples:
        - "You're asking a lot of questions today—curiosity is a great sign."
        - "3 days in a row? That consistency is going to pay off."
        - "No activity yesterday? Let's make today count."
        `;

        const result = await model.generateContent(prompt);
        const motivation = result.response.text().trim();

        return NextResponse.json({ motivation });
    } catch (error) {
        console.error('Motivation API Error:', error);
        return NextResponse.json(
            { motivation: "Consistency is key. Let's keep going." }, // Fallback
            { status: 500 }
        );
    }
}
