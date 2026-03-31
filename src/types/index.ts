export type Board = {
  id: string
  name: string
  board_type: 'SCAB' | 'BOA' | 'EXEC'
  description: string | null
  meeting_cadence: string | null
  created_at: string
}

export type Meeting = {
  id: string
  board_id: string
  title: string
  description: string | null
  scheduled_at: string
  duration_minutes: number
  location: string | null
  video_conference_url: string | null
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  recording_url: string | null
  transcript_url: string | null
  transcript_text: string | null
  created_by: string
  created_at: string
}

export type ActionItem = {
  id: string
  meeting_id: string
  title: string
  description: string | null
  assigned_to: string
  due_date: string | null
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  created_by: string
  created_at: string
}

export type Agenda = {
  id: string
  meeting_id: string
  title: string
  items: AgendaItem[]
  created_by: string
  created_at: string
}

export type AgendaItem = {
  id: string
  agenda_id: string
  title: string
  description: string | null
  time_allocation_minutes: number | null
  sort_order: number
}

export type Notification = {
  id: string
  user_id: string
  type: string
  title: string
  message: string | null
  related_meeting_id: string | null
  is_read: boolean
  created_at: string
}

export type User = {
  id: string
  email: string
  full_name: string
  role: 'ADMIN' | 'CEO' | 'MEMBER' | 'OBSERVER'
  created_at: string
}
