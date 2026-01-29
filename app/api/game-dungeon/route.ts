import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    if (!apiKey) {
        console.error("Dungeon API Error: API Key missing");
        return NextResponse.json(
            { error: "Gemini API Key is not configured." },
            { status: 500 }
        );
    }

    let requestData: any = {};
    try {
        requestData = await req.json();
        const { type, topic, question, message, history, correctAnswer, userAnswer } = requestData;

        console.log(`Dungeon Request: ${type} | AI Model Targeting: gemini-3-flash-preview`);

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using gemini-1.5-flash as it is more likely to be available than preview/exp in standard setups
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        if (type === 'GENERATE_CARDS') {
            const prompt = `You are a master educator. Generate 10 unique and diverse flashcards for the topic: "${topic}". 
            Format the response as a valid JSON array of objects. 
            Each object must follow this strict structure:
            {
                "id": "unique-string",
                "question": "the question text",
                "answer": "the concise correct answer",
                "difficulty": "easy" | "medium" | "hard" | "boss",
                "hints": ["hint 1", "hint 2"]
            }
            Rules:
            1. Difficulty should scale from easy to hard.
            2. The 10th card MUST be a "boss" difficulty card - it should be a synthesis or summary question.
            3. Return ONLY the JSON array. No markdown formatting, no conversational text.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            try {
                // More robust JSON extraction: find first '[' and last ']'
                const jsonMatch = text.match(/\[[\s\S]*\]/);
                const jsonStr = jsonMatch ? jsonMatch[0] : text;
                return NextResponse.json(JSON.parse(jsonStr));
            } catch (e) {
                console.error("AI JSON Parse Error (Cards):", text);
                throw new Error("AI returned invalid JSON for cards");
            }
        }

        if (type === 'JUDGE_ANSWER') {
            const prompt = `You are an educational judge in a dungeon crawler game.
            Topic: "${topic}"
            Question: "${question}"
            Reference Correct Answer: "${correctAnswer}"
            Student's Answer: "${userAnswer}"

            Judge if the student's answer is semantically correct or "close enough" to the reference answer.
            Return ONLY a JSON object:
            {
                "isCorrect": boolean,
                "feedback": "A short encouraging message or a brief correction if wrong."
            }`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            try {
                // More robust JSON extraction: find first '{' and last '}'
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : text;
                return NextResponse.json(JSON.parse(jsonStr));
            } catch (e) {
                console.error("AI JSON Parse Error (Judge):", text);
                throw new Error("AI returned invalid JSON for judging");
            }
        }

        if (type === 'CHAT') {
            const prompt = `You are AI Sifu, a wise and encouraging mentor in a dungeon crawler game. 
            The current topic is "${topic}". 
            The specific question the student is facing is: "${question}".
            The student says: "${message}"
            Provide a helpful, concise response that guides them toward understanding without giving away the answer directly if they haven't failed yet.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return NextResponse.json({ message: response.text() });
        }

        if (type === 'STUDY_NOTES') {
            const prompt = `The student just finished a dungeon run on the topic: "${topic}".
            Here is their history of questions they encountered: ${JSON.stringify(history)}.
            Generate encouraging study notes and 3 key areas for improvement. Format as markdown.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return NextResponse.json({ feedback: response.text() });
        }

        return NextResponse.json({ error: "Invalid request type" }, { status: 400 });

    } catch (error: any) {
        console.error(`Dungeon API Error [${requestData?.type || 'UNKNOWN'}]:`, error);
        return NextResponse.json(
            {
                error: "Failed to process AI request",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
