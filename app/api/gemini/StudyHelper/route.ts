import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function POST(req: Request) {
    if (!apiKey) {
        return NextResponse.json({ error: "API Key not configured." }, { status: 500 });
    }

    try {
        const { transcript, prompt } = await req.json();

        if (!transcript) {
            return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const Prompt = `You are a professional study assistant. Use the following format for the notes:
---
User will send you an audio transcript of a lecture, and you need to summarize the main points the teachers mentions in the lecture, create a notes effectively for students, making it clear, concise, and easy to study.
If the teacher mentions any tips or tricks, highlight them in the notes.
If the content of the transcript is unrelated to a lecture or just some random noise and chating sound, please ignore it and return "Not a lecture, pls re-record your audio.".
---
`;

        const result = await model.generateContent([
            { text: transcript }, { text: Prompt }
        ]);

        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ message: text });
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate response" },
            { status: 500 }
        );
    }
}