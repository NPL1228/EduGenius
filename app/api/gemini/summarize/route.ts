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
        const { text, fileData, mimeType } = await req.json();

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        let propmt =
            `Analyze this content and create a comprehensive, well-structured note. 
        Use formatting like bolding, bullet points, and headers to make it easy to study.
        Frist, create a title for the note. 
        Then Create sub-title for the note and the explanation. 
        If the content can be explain by example add one or two examples.
        If it's a long document, summarize the key points.
        If the content is a ppt format add which slide is the content`;

        let result;

        if (fileData && mimeType) {
            // Handle file input (PDF/Image)
            const part = {
                inlineData: {
                    data: fileData,
                    mimeType: mimeType,
                },
            };

            result = await model.generateContent([propmt, part]);
        } else if (text) {
            // Handle text input
            result = await model.generateContent([propmt, text]);
        } else {
            return NextResponse.json(
                { error: "No content provided" },
                { status: 400 }
            );
        }

        const response = await result.response;
        const summary = response.text();

        return NextResponse.json({ summary });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to generate summary" },
            { status: 500 }
        );
    }
}
