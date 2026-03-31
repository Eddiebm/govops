// In-memory data store for demo
// Switch to Supabase, Firebase, or MongoDB later (5 min swap)

export const mockData = {
  users: [
    {
      id: '1',
      email: 'eddie@coare.io',
      full_name: 'Eddie Bannerman-Menson',
      role: 'CEO' as const,
      created_at: new Date().toISOString(),
    },
  ],
  boards: [
    {
      id: '1',
      name: 'Scientific & Clinical Advisory Board',
      board_type: 'SCAB' as const,
      description: 'Scientific rigor and therapeutic validation',
      meeting_cadence: 'Quarterly',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Board of Advisors',
      board_type: 'BOA' as const,
      description: 'Capital formation, partnerships, positioning',
      meeting_cadence: 'Quarterly',
      created_at: new Date().toISOString(),
    },
  ],
  meetings: [] as any[],
  actionItems: [] as any[],
}

export const supabase = null // Not using for now
