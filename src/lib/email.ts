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
  description?: string;
  agenda?: string;
}): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("Resend API key not configured. Email not sent.");
    return;
  }

  const meetingDate = new Date(params.scheduledAt).toLocaleString();
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #1f2937;">Meeting Invitation</h2>
      <h3 style="color: #374151;">${params.meetingTitle}</h3>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Board:</strong> ${params.boardName}</p>
        <p><strong>Date & Time:</strong> ${meetingDate}</p>
        <p><strong>Location:</strong> ${params.location}</p>
      </div>

      ${params.description ? `<div style="margin: 20px 0;"><strong>Description:</strong><p>${params.description.replace(/\n/g, '<br>')}</p></div>` : ''}
      
      ${params.agenda ? `<div style="margin: 20px 0;"><strong>Agenda:</strong><pre style="background-color: #f9fafb; padding: 15px; border-radius: 8px; overflow-x: auto;">${params.agenda}</pre></div>` : ''}

      <p style="margin-top: 30px; color: #6b7280; font-size: 12px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color: #0891b2;">View in GovOps</a>
      </p>
    </div>
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

export async function sendMeetingMinutes(params: {
  boardName: string;
  meetingTitle: string;
  summary: string;
  keyDecisions: string[];
  nextSteps: string[];
  actionItems: Array<{ task: string; owner: string; dueDate: string }>;
  boardMembers: string[];
}): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("Resend API key not configured. Email not sent.");
    return;
  }

  const actionItemsHtml = params.actionItems.length > 0 
    ? `<div style="margin: 20px 0;">
        <strong>Action Items:</strong>
        <ul>
          ${params.actionItems.map(item => 
            `<li><strong>${item.task}</strong> - Assigned to: ${item.owner}, Due: ${new Date(item.dueDate).toLocaleDateString()}</li>`
          ).join('')}
        </ul>
      </div>`
    : '';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #1f2937;">Meeting Minutes</h2>
      <h3 style="color: #374151;">${params.meetingTitle}</h3>
      <p style="color: #6b7280;"><strong>Board:</strong> ${params.boardName}</p>

      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <strong>Summary:</strong>
        <p>${params.summary.replace(/\n/g, '<br>')}</p>
      </div>

      ${params.keyDecisions.length > 0 ? `
        <div style="margin: 20px 0;">
          <strong>Key Decisions:</strong>
          <ul>
            ${params.keyDecisions.map(decision => `<li>${decision}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${params.nextSteps.length > 0 ? `
        <div style="margin: 20px 0;">
          <strong>Next Steps:</strong>
          <ul>
            ${params.nextSteps.map(step => `<li>${step}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${actionItemsHtml}

      <p style="margin-top: 30px; color: #6b7280; font-size: 12px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color: #0891b2;">View in GovOps</a>
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.boardMembers,
      subject: `Meeting Minutes: ${params.meetingTitle}`,
      html,
    });
    console.log("Meeting minutes sent to", params.boardMembers.length, "members");
  } catch (error) {
    console.error("Error sending meeting minutes:", error);
    throw error;
  }
}

export async function sendActionItemAssignment(params: {
  assignee: string;
  assigneeEmail: string;
  task: string;
  dueDate: string;
  boardName: string;
  description?: string;
}): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("Resend API key not configured. Email not sent.");
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #1f2937;">Action Item Assigned</h2>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Task:</strong> ${params.task}</p>
        <p><strong>Board:</strong> ${params.boardName}</p>
        <p><strong>Due Date:</strong> ${new Date(params.dueDate).toLocaleDateString()}</p>
        ${params.description ? `<p><strong>Details:</strong> ${params.description}</p>` : ''}
      </div>

      <p style="margin-top: 30px; color: #6b7280; font-size: 12px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color: #0891b2;">View in GovOps</a>
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [params.assigneeEmail],
      subject: `Action Item Assigned: ${params.task}`,
      html,
    });
    console.log("Action item assigned to", params.assignee);
  } catch (error) {
    console.error("Error sending action item assignment:", error);
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
