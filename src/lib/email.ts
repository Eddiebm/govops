import { Resend } from "resend";

// Lazy initialize - only when actually used
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const FROM_EMAIL = "eddie@coareholdings.com";

export async function sendMeetingInvite(params: {
  boardName: string;
  meetingTitle: string;
  scheduledAt: string;
  location: string;
  boardMembers: string[];
}): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("Resend API key not configured. Email not sent.");
    return;
  }

  const html = `
    <h2>You're Invited: ${params.meetingTitle}</h2>
    <p><strong>Board:</strong> ${params.boardName}</p>
    <p><strong>Date & Time:</strong> ${new Date(params.scheduledAt).toLocaleString()}</p>
    <p><strong>Location:</strong> ${params.location}</p>
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">View in GovOps</a></p>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.boardMembers,
      subject: `Meeting Invitation: ${params.meetingTitle}`,
      html,
    });
    console.log("Meeting invite sent to", params.boardMembers.length, "members");
  } catch (error) {
    console.error("Error sending meeting invite:", error);
    throw error;
  }
}

export async function sendMinutesNotification(params: {
  boardName: string;
  meetingTitle: string;
  summary: string;
  boardMembers: string[];
}): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("Resend API key not configured. Email not sent.");
    return;
  }

  const html = `
    <h2>Meeting Minutes: ${params.meetingTitle}</h2>
    <p><strong>Board:</strong> ${params.boardName}</p>
    <h3>Summary</h3>
    <p>${params.summary.replace(/\n/g, "<br>")}</p>
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">View full minutes in GovOps</a></p>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.boardMembers,
      subject: `Meeting Minutes: ${params.meetingTitle}`,
      html,
    });
    console.log(
      "Minutes notification sent to",
      params.boardMembers.length,
      "members"
    );
  } catch (error) {
    console.error("Error sending minutes notification:", error);
    throw error;
  }
}

export async function sendActionItemAssignment(params: {
  assignee: string;
  task: string;
  dueDate: string;
  boardName: string;
}): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("Resend API key not configured. Email not sent.");
    return;
  }

  const html = `
    <h2>Action Item Assigned to You</h2>
    <p><strong>Board:</strong> ${params.boardName}</p>
    <p><strong>Task:</strong> ${params.task}</p>
    <p><strong>Due Date:</strong> ${new Date(params.dueDate).toLocaleDateString()}</p>
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">View in GovOps</a></p>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [params.assignee],
      subject: `Action Item Assigned: ${params.task}`,
      html,
    });
    console.log("Action item assigned to", params.assignee);
  } catch (error) {
    console.error("Error sending action item assignment:", error);
    throw error;
  }
}
