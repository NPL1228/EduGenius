import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Types
interface Task {
    id: string;
    subject: string;
    title: string;
    minutes: number;
    deadline?: string;
    completed?: boolean;
    startTime?: string;
    importance?: number;
    difficulty?: number;
    isPinned?: boolean;
    color?: string;
    notes?: string;
}

interface UnavailableTime {
    id: string;
    label: string;
    startHour: number;
    endHour: number;
    days: number[];
}

interface SubjectPreferences {
    [subject: string]: {
        preferredHours: number[];
    };
}

interface ScheduleRequest {
    tasks: Task[];
    unavailableTimes: UnavailableTime[];
    subjectPreferences: SubjectPreferences;
    maxStudyHoursPerDay: number;
    currentDate: string;
}

export async function POST(req: Request) {
    if (!apiKey) {
        return NextResponse.json(
            { error: "Gemini API Key is not configured" },
            { status: 500 }
        );
    }

    try {
        const data: ScheduleRequest = await req.json();
        const { tasks, unavailableTimes, subjectPreferences, maxStudyHoursPerDay, currentDate } = data;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        // Build comprehensive prompt with all rules
        const prompt = `You are an AI study scheduler. Your task is to create an optimal weekly study schedule following strict rules.

**CURRENT DATE & TIME**: ${currentDate}

**SCHEDULING SCOPE RULES**:
- Only schedule pending (uncompleted) tasks
- Never modify past or completed blocks
- Only schedule into future time slots
- Completed tasks are excluded from scheduling

**TASKS TO SCHEDULE**:
${JSON.stringify(tasks.filter(t => !t.completed && !t.isPinned), null, 2)}

**PINNED TASKS (DO NOT RESCHEDULE)**:
${JSON.stringify(tasks.filter(t => t.isPinned && !t.completed), null, 2)}

**UNAVAILABLE TIMES (STRICT CONSTRAINTS)**:
${JSON.stringify(unavailableTimes, null, 2)}

**SUBJECT PREFERENCES (LEARNED FROM USER)**:
${JSON.stringify(subjectPreferences, null, 2)}

**CONSTRAINTS**:
- Maximum study hours per day: ${maxStudyHoursPerDay}
- Study blocks MUST NEVER overlap each other
- Study blocks MUST NEVER overlap unavailable times
- **CRITICAL**: Insert a 30-minute rest break AFTER every study block. (e.g., if task ends at 10:00, next task cannot start before 10:30)
- All times are in 24-hour format (0-23)
- Days: 0=Monday, 1=Tuesday, 2=Wednesday, 3=Thursday, 4=Friday, 5=Saturday, 6=Sunday

**PRIORITY RULES**:
Calculate priority score for each task:
- Deadline urgency: If deadline exists, use exponential weight: 1000 * Math.pow(0.8, daysUntilDeadline)
- Importance weight: 0.4
- Difficulty weight: 0.3
- Urgency weight: 5.0
- Formula: (importance * 0.4) + (difficulty * 0.3) + (urgency * 5.0)

Schedule high-priority tasks:
- Earlier in the week
- During preferred hours (if learned)
- With adequate time allocation

**PLACEMENT STRATEGY**:
1. Sort tasks by priority (highest first)
2. For each task, search up to 6 weeks (42 days) ahead
3. Prefer user's preferred hours for each subject
4. Avoid overloading any single day
5. Split large tasks across multiple days if needed
6. Ensure no conflicts with unavailable times or other tasks

**TIME ALLOCATION**:
- Distribute study time evenly across the week
- Prefer multiple medium blocks over one long block
- Match block duration to task requirements

**OUTPUT FORMAT**:
Return a JSON object with this exact structure:
{
  "scheduledTasks": [
    {
      "id": "task_id",
      "startTime": "ISO 8601 datetime string",
      "reasoning": "Brief explanation of placement"
    }
  ],
  "unscheduledTasks": [
    {
      "id": "task_id",
      "reason": "Why it couldn't be scheduled",
      "suggestions": ["Alternative 1", "Alternative 2"]
    }
  ],
  "insights": {
    "totalScheduled": number,
    "totalUnscheduled": number,
    "weeklyStudyHours": number,
    "recommendations": ["Recommendation 1", "Recommendation 2"]
  }
}

**CRITICAL RULES**:
- Every scheduled task MUST have a valid startTime that doesn't conflict
- If a task cannot be scheduled, include it in unscheduledTasks with suggestions
- Respect all unavailable time blocks strictly
- Consider subject preferences when available
- Ensure future-only scheduling (no past dates)

Now, create the optimal schedule following ALL these rules.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let aiResponse = response.text();

        // Clean up markdown code blocks if present
        aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Parse the AI response
        const schedule = JSON.parse(aiResponse);

        return NextResponse.json(schedule);

    } catch (error) {
        console.error("AI Scheduler Error:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to generate schedule",
                details: error instanceof Error ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}
