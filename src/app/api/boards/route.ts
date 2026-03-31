import { NextRequest, NextResponse } from "next/server";
import { generateAgendaFromNotes, generateMinutesFromNotes } from "@/lib/claude";
import { sendMeetingInvite, sendMinutesNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case "generateAgenda":
        const agenda = await generateAgendaFromNotes(data.notes);
        return NextResponse.json({ agenda });

      case "generateMinutes":
        const minutes = await generateMinutesFromNotes(data.notes);
        return NextResponse.json(minutes);

      case "sendMeetingInvite":
        await sendMeetingInvite({
          boardName: data.boardName,
          meetingTitle: data.meetingTitle,
          scheduledAt: data.scheduledAt,
          location: data.location,
          boardMembers: data.boardMembers,
        });
        return NextResponse.json({ success: true });

      case "sendMinutes":
        await sendMinutesNotification({
          boardName: data.boardName,
          meetingTitle: data.meetingTitle,
          summary: data.summary,
          boardMembers: data.boardMembers,
        });
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Board API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
