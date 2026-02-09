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
  preferredRestTime: number;
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
    const { tasks, unavailableTimes, subjectPreferences, maxStudyHoursPerDay, preferredRestTime, currentDate } = data;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // Build comprehensive prompt with all rules
    const prompt = `You are an AI study scheduler. Your task is to create an optimal weekly study schedule following these strict rules:

**RULE 1: LOAD ALL CONSTRAINTS AND PENDING TASKS**
- Use the provided PENDING TASKS and UNAVAILABLE TIMES.
- CURRENT DATE & TIME: ${currentDate}
- User's Preferred Rest Time: ${preferredRestTime} minutes (MANDATORY).

**RULE 2: FILTER OUT UNAVAILABLE TIME**
- Study blocks MUST NEVER overlap with any UNAVAILABLE TIMES (Sleep, Classes, Work, etc.).
- Rest time should not be added inside Sleep, Meals, or Unavailable blocks.

**RULE 3: SCORE TASKS BY MULTIPLE FACTORS**
Score each task based on:
1. **Deadline Urgency**: Tasks with closer deadlines get higher priority.
2. **Importance**: User-defined importance level (0-100).
3. **Difficulty**: User-defined difficulty level (0-100).
4. **Past Performance & Preferences**: Use the SUBJECT PREFERENCES to place tasks in slots where the user is most productive.

**RULE 4: ALLOCATE STUDY TIME PER TASK**
- Respect the "minutes" required for each task. Split large tasks into multiple slots if needed.

**RULE 5: GENERATE NON-OVERLAPPING TIME BLOCKS WITH MANDATORY REST**
- No two study sessions can overlap. 
- You MUST insert a ${preferredRestTime}-minute rest break AFTER every study session on the same day.
- This rest break applies even if the consecutive blocks are for different subjects.
- Rest time MUST NOT overlap with study blocks or unavailable time.
- Rest time DOES NOT count toward "max study hours per day".
- **EXCEPTION**: The first study block of the day does not require rest before it. The last study block of the day does not require rest after it.

**RULE 6: PREFER EARLIER PLACEMENT FOR HIGHER-PRIORITY TASKS**
- Tasks with the highest scores MUST be placed as early as possible in the schedule.

**RULE 7: BALANCE WORKLOAD ACROSS DAYS**
- Do not exceed the "Maximum study hours per day": ${maxStudyHoursPerDay} hrs.
- Distribute tasks evenly to prevent burnout.
- If available time is limited, prioritize rest time over study duration (shorten or split the study block, but never remove rest time).

**RULE 8: DO NOT MODIFY COMPLETED OR PAST BLOCKS**
- Only schedule from the current time onwards. 
- Completed tasks and past sessions are strictly read-only.

**RULE 9: RESPECT USER MANUAL EDITS (PINNED TASKS)**
- Tasks with "isPinned": true have a fixed startTime set by the user.
- **EXCEPTION**: If a pinned task conflicts with RULE 2, RULE 5, or RULE 10, YOU MUST RESCHEDULE IT to the nearest available slot.

**RULE 10: DETECT AND AVOID ALL CONFLICTS**
- Every task in the schedule MUST have a valid, non-overlapping startTime that respects the mandatory rest time.
- If a task cannot fit anywhere, list it in "unscheduledTasks".

**DATA**:
PENDING TASKS:
${JSON.stringify(tasks.filter(t => !t.completed), null, 2)}

UNAVAILABLE TIMES:
${JSON.stringify(unavailableTimes, null, 2)}

SUBJECT PREFERENCES:
${JSON.stringify(subjectPreferences || {}, null, 2)}

**OUTPUT FORMAT**:
Return a JSON object:
{
  "scheduledTasks": [{ "id": "task_id", "startTime": "ISO String", "reasoning": "Why this time?" }],
  "unscheduledTasks": [{ "id": "task_id", "reason": "Why?" }],
  "insights": { "totalScheduled": number, "totalUnscheduled": number, "weeklyStudyHours": number }
}

Provide the optimal schedule now.`;

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
