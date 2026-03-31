import { NextRequest, NextResponse } from "next/server";
import { generateAgendaFromNotes, generateMinutesFromNotes } from "@/lib/claude";
import { sendMeetingInvite, sendMeetingMinutes, sendActionItemAssignment, sendMinutesNotification } from "@/lib/email";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let db: any = null;

function getDb() {
  if (!db) {
    if (getApps().length === 0) {
      const app = initializeApp(firebaseConfig);
      db = getFirestore(app);
    } else {
      db = getFirestore(getApps()[0]);
    }
  }
  return db;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'getMembers') {
      const db = getDb();
      const membersRef = collection(db, 'members');
      const snapshot = await getDocs(membersRef);
      const members = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      return NextResponse.json({ members });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Board API GET error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action || body.data?.action;

    // Check for required API keys
    if (!process.env.ANTHROPIC_API_KEY && (action === "generateAgenda" || action === "generateMinutes")) {
      return NextResponse.json(
        { error: "Claude API key not configured. Please add ANTHROPIC_API_KEY to environment variables." },
        { status: 500 }
      );
    }

    switch (action) {
      case "saveMember": {
        const db = getDb();
        const membersRef = collection(db, 'members');
        await addDoc(membersRef, body.member);
        return NextResponse.json({ success: true });
      }

      case "deleteMember": {
        const db = getDb();
        const memberRef = doc(db, 'members', body.memberId);
        await deleteDoc(memberRef);
        return NextResponse.json({ success: true });
      }

      case "generateAgenda":
        const agenda = await generateAgendaFromNotes(body.data?.notes || body.notes);
        return NextResponse.json({ agenda });

      case "generateMinutes":
        const minutes = await generateMinutesFromNotes(body.data?.notes || body.notes);
        return NextResponse.json(minutes);

      case "sendMeetingInvite":
        await sendMeetingInvite({
          boardName: body.boardName,
          meetingTitle: body.meetingTitle,
          scheduledAt: body.scheduledAt,
          location: body.location,
          boardMembers: body.boardMembers,
          description: body.description,
          agenda: body.agenda,
        });
        return NextResponse.json({ success: true });

      case "sendMeetingInvites":
        await sendMeetingInvite({
          boardName: body.boardName,
          meetingTitle: body.meetingTitle,
          scheduledAt: body.scheduledAt,
          location: body.location,
          boardMembers: body.boardMembers,
          description: body.description,
          agenda: body.agenda,
        });
        return NextResponse.json({ success: true });

      case "sendMeetingMinutes":
        await sendMeetingMinutes({
          boardName: body.boardName,
          meetingTitle: body.meetingTitle,
          summary: body.summary,
          keyDecisions: body.keyDecisions || [],
          nextSteps: body.nextSteps || [],
          actionItems: body.actionItems || [],
          boardMembers: body.boardMembers,
        });
        return NextResponse.json({ success: true });

      case "sendMinutes":
        await sendMinutesNotification({
          boardName: body.boardName,
          meetingTitle: body.meetingTitle,
          summary: body.summary,
          boardMembers: body.boardMembers,
        });
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Board API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
