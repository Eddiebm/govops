// Server-side only - API key never exposed to client
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateAgendaFromNotes(notes: string): Promise<string> {
  try {
    const message = await client.messages.create({
      model: "claude-opus-4-20250805",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a governance expert. Convert these meeting notes into a structured agenda with clear topics and time allocations. Format as markdown with bullet points.

Notes:
${notes}

Return ONLY the agenda, no preamble.`,
        },
      ],
    });

    const textContent = message.content[0];
    if (textContent.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }
    return textContent.text;
  } catch (error) {
    console.error("Claude API error:", error);
    throw new Error("Failed to generate agenda");
  }
}

export async function generateMinutesFromNotes(notes: string): Promise<{
  summary: string;
  keyDecisions: string[];
  nextSteps: string[];
  actionItems: Array<{ task: string; owner: string; dueDate: string }>;
}> {
  try {
    const message = await client.messages.create({
      model: "claude-opus-4-20250805",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a governance expert. Convert these meeting notes into structured minutes. Extract:
1. Summary (2-3 sentences)
2. Key decisions (bullet list)
3. Next steps (bullet list)
4. Action items (with owner and due date)

Notes:
${notes}

Return JSON only (no markdown, no code blocks):
{
  "summary": "...",
  "keyDecisions": ["...", "..."],
  "nextSteps": ["...", "..."],
  "actionItems": [
    {"task": "...", "owner": "...", "dueDate": "..."}
  ]
}`,
        },
      ],
    });

    const textContent = message.content[0];
    if (textContent.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    try {
      return JSON.parse(textContent.text);
    } catch {
      return {
        summary: textContent.text,
        keyDecisions: [],
        nextSteps: [],
        actionItems: [],
      };
    }
  } catch (error) {
    console.error("Claude API error:", error);
    throw new Error("Failed to generate minutes");
  }
}

export async function generateBoardSummary(
  boardType: "SCAB" | "BOA" | "BOD",
  meetingNotes: string
): Promise<string> {
  try {
    const boardContext = {
      SCAB: "Scientific & Clinical Advisory Board - focus on scientific rigor and therapeutic validation",
      BOA: "Board of Advisors - focus on capital formation and strategic partnerships",
      BOD: "Board of Directors - focus on governance and company direction",
    };

    const message = await client.messages.create({
      model: "claude-opus-4-20250805",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `You are a governance expert for a biotech company.

Board Type: ${boardType}
Board Focus: ${boardContext[boardType]}

Meeting Notes:
${meetingNotes}

Write a concise executive summary (2-3 paragraphs) of the meeting for this board.`,
        },
      ],
    });

    const textContent = message.content[0];
    if (textContent.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }
    return textContent.text;
  } catch (error) {
    console.error("Claude API error:", error);
    throw new Error("Failed to generate summary");
  }
}
