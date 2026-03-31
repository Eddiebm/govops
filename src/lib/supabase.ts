import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'ADMIN' | 'CEO' | 'MEMBER' | 'OBSERVER'
          created_at: string
        }
      }
      boards: {
        Row: {
          id: string
          name: string
          board_type: 'SCAB' | 'BOA' | 'EXEC'
          description: string | null
          meeting_cadence: string | null
          created_at: string
        }
      }
      meetings: {
        Row: {
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
      }
      action_items: {
        Row: {
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
      }
    }
  }
}
