import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function POST(req: Request) {
    if (!apiKey) {
        return NextResponse.json(
            { error: "Gemini API Key is not configured. Please check your .env file." },
            { status: 500 }
        );
    }

    try {
        const { message, image, mimeType } = await req.json();

        if (!message && !image) {
            return NextResponse.json(
                { error: "No content provided" },
                { status: 400 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Use gemini-pro-vision for image support, or gemini-pro for text-only
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview"
        });

        // Educational tutor system prompt
        const systemPrompt = `You are an expert educational AI tutor powered by Google Gemini. Your goal is to help students learn effectively by:

1. **For Visual Problems (images of questions, handwriting, equations, diagrams)**:
   - Carefully analyze the image to identify handwriting, symbols, equations, and diagrams
   - Recognize the subject area (math, physics, chemistry, etc.)
   - Identify any errors or misconceptions
   - Provide step-by-step explanations with clear reasoning
   - Break down complex problems into manageable steps
   - Use analogies and examples when helpful

2. **Teaching Approach**:
   - Be patient and encouraging
   - Explain concepts clearly without being condescending
   - Ask guiding questions to promote critical thinking
   - Provide examples and practice suggestions
   - Use formatting (bold, bullet points, numbered lists) for clarity

3. **Response Style**:
   - Start by acknowledging what you see in the image (if applicable)
   - Explain the concept or solution step-by-step
   - Highlight key formulas, theorems, or principles
   - End with a summary or key takeaway
   - Suggest related practice problems or concepts to explore

Remember: Your goal is to help students UNDERSTAND, not just get the answer.`;

        let prompt = systemPrompt + "\n\n" + message;
        let parts: any[] = [];

        if (image && mimeType) {
            // Handle image + text input
            parts = [
                {
                    text: prompt
                },
                {
                    inlineData: {
                        data: image,
                        mimeType: mimeType,
                    },
                }
            ];
        } else {
            // Handle text-only input
            parts = [{ text: prompt }];
        }

        const result = await model.generateContent(parts);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ message: text });

    } catch (error: any) {
        console.error("Gemini API Error Detail:", error);
        console.error("Error Message:", error.message);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to generate response" },
            { status: 500 }
        );
    }
}
