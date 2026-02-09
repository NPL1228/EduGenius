import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function POST(req: Request) {
    if (!apiKey) {
        return NextResponse.json(
            { error: "Gemini API Key is not configured" },
            { status: 500 }
        );
    }

    try {
        const { tasks, currentSuggestion } = await req.json();

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `You are an intelligent study assistant. 
        Analyze the student's current tasks and provide a natural, conversational study suggestion.
        
        Current Tasks:
        ${JSON.stringify(tasks, null, 2)}

        Previous Suggestion: "${currentSuggestion}" (Try to be different from this)

        Structure your response as a single, short, normal-talking paragraph:
        - Start with the study priority and the reason why it's important right now.
        - Transition into a specific study method they should use.
        - End with a short, encouraging sentence.

        Rules:
        1. DO NOT use point form, bullet points, or headers.
        2. Write naturally, like a mentor talking to a student.
        3. Keep the total response concise (max 3-4 sentences).
        4. Return ONLY the paragraph text, no extra commentary.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const suggestion = response.text().trim();

        return NextResponse.json({ suggestion });

    } catch (error) {
        console.error("AI Suggestion Error:", error);
        return NextResponse.json(
            { error: "Failed to generate suggestion" },
            { status: 500 }
        );
    }
}
