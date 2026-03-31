'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useFirebaseAuth'
import { useFirestore } from '@/hooks/useFirestore'
import { useRouter } from 'next/navigation'

const BOARDS = [
  {
    id: 'scab',
    name: 'Scientific & Clinical Advisory Board',
    type: 'SCAB',
    description: 'Scientific rigor and therapeutic validation',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    id: 'boa',
    name: 'Board of Advisors',
    type: 'BOA',
    description: 'Capital formation, partnerships, positioning',
    color: 'bg-green-50 border-green-200',
  },
  {
    id: 'bod',
    name: 'Board of Directors',
    type: 'BOD',
    description: 'Governance and company direction',
    color: 'bg-purple-50 border-purple-200',
  },
]

interface Member {
  id: string
  name: string
  email: string
  boards: string[]
}

interface ActionItem {
  id: string
  title: string
  description: string
  assignedTo: string
  dueDate: string
  status: 'open' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  boardId: string
  createdAt: string
}

interface Meeting {
  id: string
  title: string
  boardId: string
  scheduledAt: string
  location: string
  description: string
  attendees: string[]
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: string
}

export default function DashboardPage() {
  const { user, logOut, loading: authLoading } = useAuth()
  const { data: boards } = useFirestore('boards')
  const router = useRouter()
  const [isInitialized, setIsInitialized] = useState(false)
  const [showBoardsView, setShowBoardsView] = useState(false)
  const [showActionItemsView, setShowActionItemsView] = useState(false)
  const [showMeetingsView, setShowMeetingsView] = useState(false)
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [generatedAgenda, setGeneratedAgenda] = useState('')
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [selectedBoardsForMember, setSelectedBoardsForMember] = useState<string[]>([])
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [showAddActionItem, setShowAddActionItem] = useState(false)
  const [newActionTitle, setNewActionTitle] = useState('')
  const [newActionDescription, setNewActionDescription] = useState('')
  const [newActionAssignee, setNewActionAssignee] = useState('')
  const [newActionDueDate, setNewActionDueDate] = useState('')
  const [newActionPriority, setNewActionPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium')
  const [newActionBoardId, setNewActionBoardId] = useState('')
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [showAddMeeting, setShowAddMeeting] = useState(false)
  const [newMeetingTitle, setNewMeetingTitle] = useState('')
  const [newMeetingBoardId, setNewMeetingBoardId] = useState('')
  const [newMeetingDate, setNewMeetingDate] = useState('')
  const [newMeetingTime, setNewMeetingTime] = useState('')
  const [newMeetingLocation, setNewMeetingLocation] = useState('')
  const [newMeetingDescription, setNewMeetingDescription] = useState('')
  const [newMeetingAttendees, setNewMeetingAttendees] = useState<string[]>([])
  const [showSendInvite, setShowSendInvite] = useState(false)
  const [selectedMeetingToInvite, setSelectedMeetingToInvite] = useState<string | null>(null)
  const [showSendMinutes, setShowSendMinutes] = useState(false)
  const [selectedMeetingForMinutes, setSelectedMeetingForMinutes] = useState<string | null>(null)
  const [minutesSummary, setMinutesSummary] = useState('')
  const [minutesDecisions, setMinutesDecisions] = useState('')
  const [minutesNextSteps, setMinutesNextSteps] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    } else if (!authLoading && user) {
      setIsInitialized(true)
    }
  }, [user, authLoading, router])

  // Load members from Firebase
  useEffect(() => {
    if (isInitialized) {
      const loadMembers = async () => {
        try {
          const response = await fetch('/api/boards?action=getMembers')
          if (response.ok) {
            const data = await response.json()
            setMembers(data.members || [])
          }
        } catch (error) {
          console.error('Error loading members:', error)
        }
      }
      loadMembers()
    }
  }, [isInitialized])

  const handleLogout = async () => {
    await logOut()
    router.push('/auth/login')
  }

  const handleGenerateAgenda = async () => {
    if (!notes.trim()) {
      alert('Please enter meeting notes')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateAgenda',
          data: { notes },
        }),
      })

      const result = await response.json()
      if (result.error) {
        alert('Error: ' + result.error)
        return
      }
      setGeneratedAgenda(result.agenda)
    } catch (error) {
      console.error('Error generating agenda:', error)
      alert('Failed to generate agenda')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      alert('Please enter both name and email')
      return
    }

    if (selectedBoardsForMember.length === 0) {
      alert('Please select at least one board')
      return
    }

    const newMember: Member = {
      id: Date.now().toString(),
      name: newMemberName,
      email: newMemberEmail,
      boards: selectedBoardsForMember,
    }

    setMembers([...members, newMember])
    setNewMemberName('')
    setNewMemberEmail('')
    setSelectedBoardsForMember([])
    setShowAddMember(false)

    // Save to Firebase
    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'saveMember',
          member: newMember,
        }),
      })
      if (!response.ok) console.error('Failed to save member to Firebase')
    } catch (error) {
      console.error('Error saving member:', error)
    }

    alert(`${newMemberName} added to ${selectedBoardsForMember.length} board(s)`)
  }

  const handleRemoveMember = async (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId))
    
    // Delete from Firebase
    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteMember',
          memberId: memberId,
        }),
      })
      if (!response.ok) console.error('Failed to delete member from Firebase')
    } catch (error) {
      console.error('Error deleting member:', error)
    }
  }

  const handleToggleBoardForMember = (boardId: string) => {
    if (selectedBoardsForMember.includes(boardId)) {
      setSelectedBoardsForMember(selectedBoardsForMember.filter(b => b !== boardId))
    } else {
      setSelectedBoardsForMember([...selectedBoardsForMember, boardId])
    }
  }

  const handleAddActionItem = () => {
    if (!newActionTitle.trim() || !newActionAssignee.trim() || !newActionDueDate || !newActionBoardId) {
      alert('Please fill in all required fields')
      return
    }

    const newItem: ActionItem = {
      id: Date.now().toString(),
      title: newActionTitle,
      description: newActionDescription,
      assignedTo: newActionAssignee,
      dueDate: newActionDueDate,
      status: 'open',
      priority: newActionPriority,
      boardId: newActionBoardId,
      createdAt: new Date().toISOString(),
    }

    setActionItems([...actionItems, newItem])
    setNewActionTitle('')
    setNewActionDescription('')
    setNewActionAssignee('')
    setNewActionDueDate('')
    setNewActionPriority('medium')
    setNewActionBoardId('')
    setShowAddActionItem(false)
    alert('Action item created!')
  }

  const handleUpdateActionItemStatus = (itemId: string, newStatus: 'open' | 'in-progress' | 'completed') => {
    setActionItems(actionItems.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    ))
  }

  const handleDeleteActionItem = (itemId: string) => {
    setActionItems(actionItems.filter(item => item.id !== itemId))
  }

  const getActionItemsByBoard = (boardId: string) => {
    return actionItems.filter(item => item.boardId === boardId)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 border-green-200'
      case 'in-progress': return 'bg-blue-50 border-blue-200'
      case 'open': return 'bg-gray-50 border-gray-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const handleAddMeeting = () => {
    if (!newMeetingTitle.trim() || !newMeetingBoardId || !newMeetingDate || !newMeetingTime || !newMeetingLocation.trim()) {
      alert('Please fill in all required fields')
      return
    }

    const scheduledAt = `${newMeetingDate}T${newMeetingTime}`
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: newMeetingTitle,
      boardId: newMeetingBoardId,
      scheduledAt,
      location: newMeetingLocation,
      description: newMeetingDescription,
      attendees: newMeetingAttendees.length > 0 ? newMeetingAttendees : [],
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    }

    setMeetings([...meetings, newMeeting])
    setNewMeetingTitle('')
    setNewMeetingBoardId('')
    setNewMeetingDate('')
    setNewMeetingTime('')
    setNewMeetingLocation('')
    setNewMeetingDescription('')
    setNewMeetingAttendees([])
    setShowAddMeeting(false)
    alert('Meeting scheduled!')
  }

  const handleDeleteMeeting = (meetingId: string) => {
    setMeetings(meetings.filter(m => m.id !== meetingId))
  }

  const handleUpdateMeetingStatus = (meetingId: string, newStatus: 'scheduled' | 'in-progress' | 'completed' | 'cancelled') => {
    setMeetings(meetings.map(m => 
      m.id === meetingId ? { ...m, status: newStatus } : m
    ))
  }

  const getMeetingsByBoard = (boardId: string) => {
    return meetings.filter(m => m.boardId === boardId)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSendMeetingInvites = async () => {
    if (!selectedMeetingToInvite) return
    
    const meeting = meetings.find(m => m.id === selectedMeetingToInvite)
    if (!meeting) return

    const board = BOARDS.find(b => b.id === meeting.boardId)
    if (!board) return

    setSendingEmail(true)
    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendMeetingInvites',
          meetingTitle: meeting.title,
          boardName: board.name,
          scheduledAt: meeting.scheduledAt,
          location: meeting.location,
          description: meeting.description,
          agenda: generatedAgenda,
          boardMembers: members.filter(m => m.boards.includes(meeting.boardId)).map(m => m.email),
        }),
      })

      if (response.ok) {
        alert('Meeting invites sent successfully!')
        setShowSendInvite(false)
        setSelectedMeetingToInvite(null)
      } else {
        alert('Error sending invites. Make sure Resend API key is configured.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error sending invites')
    } finally {
      setSendingEmail(false)
    }
  }

  const handleSendMeetingMinutes = async () => {
    if (!selectedMeetingForMinutes) return

    const meeting = meetings.find(m => m.id === selectedMeetingForMinutes)
    if (!meeting) return

    const board = BOARDS.find(b => b.id === meeting.boardId)
    if (!board) return

    if (!minutesSummary.trim()) {
      alert('Please enter a summary')
      return
    }

    setSendingEmail(true)
    try {
      const decisions = minutesDecisions.split('\n').filter(d => d.trim())
      const nextSteps = minutesNextSteps.split('\n').filter(s => s.trim())
      const boardMembers = members.filter(m => m.boards.includes(meeting.boardId)).map(m => m.email)

      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendMeetingMinutes',
          meetingTitle: meeting.title,
          boardName: board.name,
          summary: minutesSummary,
          keyDecisions: decisions,
          nextSteps: nextSteps,
          actionItems: actionItems.filter(ai => ai.boardId === meeting.boardId).map(ai => ({
            task: ai.title,
            owner: ai.assignedTo,
            dueDate: ai.dueDate,
          })),
          boardMembers: boardMembers,
        }),
      })

      if (response.ok) {
        alert('Meeting minutes sent successfully!')
        setShowSendMinutes(false)
        setSelectedMeetingForMinutes(null)
        setMinutesSummary('')
        setMinutesDecisions('')
        setMinutesNextSteps('')
      } else {
        alert('Error sending minutes. Make sure Resend API key is configured.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error sending minutes')
    } finally {
      setSendingEmail(false)
    }
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    )
  }

  // BOARDS VIEW
  if (showBoardsView) {
    const board = BOARDS.find(b => b.id === selectedBoard)
    const boardMembers = selectedBoard 
      ? members.filter(m => m.boards.includes(selectedBoard))
      : []

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <button
            onClick={() => {
              setShowBoardsView(false)
              setSelectedBoard(null)
              setNotes('')
              setGeneratedAgenda('')
            }}
            className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-12">Boards Management</h1>

          {!selectedBoard ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {BOARDS.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBoard(b.id)}
                  className={`p-6 rounded-lg border-2 text-left transition ${b.color}`}
                >
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{b.type}</h3>
                  <p className="text-sm text-gray-700">{b.name}</p>
                </button>
              ))}
            </div>
          ) : board ? (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">{board.name}</h2>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Generate Agenda</h3>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Paste meeting notes..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg mb-4"
                />
                <button
                  onClick={handleGenerateAgenda}
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 font-semibold disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Agenda with AI'}
                </button>
              </div>

              {generatedAgenda && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-4">✨ Generated Agenda</h3>
                  <div className="text-gray-700 whitespace-pre-wrap mb-4">{generatedAgenda}</div>
                  <button
                    onClick={() => alert('Schedule Meeting - Coming Soon')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Schedule Meeting
                  </button>
                </div>
              )}

              <div className="border-t pt-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">👥 Members ({members.filter(m => m.boards.includes(selectedBoard)).length})</h3>
                  <button
                    onClick={() => setShowAddMember(!showAddMember)}
                    className="px-4 py-2 bg-secondary text-white rounded-lg font-semibold"
                  >
                    {showAddMember ? 'Cancel' : 'Add Member'}
                  </button>
                </div>

                {showAddMember && (
                  <div className="mb-6 p-6 bg-blue-50 rounded-lg">
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={e => setNewMemberName(e.target.value)}
                      placeholder="Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                    />
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={e => setNewMemberEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                    />
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assign to:</label>
                      {BOARDS.map(b => (
                        <label key={b.id} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={selectedBoardsForMember.includes(b.id)}
                            onChange={() => handleToggleBoardForMember(b.id)}
                            className="w-4 h-4"
                          />
                          <span className="ml-2 text-gray-700">{b.type}</span>
                        </label>
                      ))}
                    </div>
                    <button
                      onClick={handleAddMember}
                      className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold"
                    >
                      Add Member
                    </button>
                  </div>
                )}

                {boardMembers.length === 0 ? (
                  <p className="text-gray-600">No members yet</p>
                ) : (
                  <div className="space-y-3">
                    {boardMembers.map(m => (
                      <div key={m.id} className="p-4 bg-gray-50 rounded-lg flex justify-between">
                        <div>
                          <p className="font-bold">{m.name}</p>
                          <p className="text-sm text-gray-600">{m.email}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveMember(m.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedBoard(null)}
                className="mt-8 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back to Boards
              </button>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  // MEETINGS VIEW
  if (showMeetingsView) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <button onClick={() => setShowMeetingsView(false)} className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold">← Back</button>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Meetings</h1>
          <button onClick={() => setShowAddMeeting(!showAddMeeting)} className="mb-8 px-6 py-2 bg-primary text-white rounded-lg font-semibold">{showAddMeeting ? 'Cancel' : 'Schedule Meeting'}</button>

          {showAddMeeting && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule Meeting</h2>
              <input type="text" value={newMeetingTitle} onChange={e => setNewMeetingTitle(e.target.value)} placeholder="Meeting title" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4" />
              <select value={newMeetingBoardId} onChange={e => setNewMeetingBoardId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4">
                <option value="">Select Board</option>
                {BOARDS.map(b => <option key={b.id} value={b.id}>{b.type}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="date" value={newMeetingDate} onChange={e => setNewMeetingDate(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="time" value={newMeetingTime} onChange={e => setNewMeetingTime(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <input type="text" value={newMeetingLocation} onChange={e => setNewMeetingLocation(e.target.value)} placeholder="Location" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4" />
              <textarea value={newMeetingDescription} onChange={e => setNewMeetingDescription(e.target.value)} placeholder="Description (optional)" className="w-full px-4 py-2 border border-gray-300 rounded-lg h-20 mb-4" />
              <button onClick={handleAddMeeting} className="w-full px-6 py-2 bg-primary text-white rounded-lg font-semibold">Schedule</button>
            </div>
          )}

          {meetings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center"><p className="text-gray-600">No meetings scheduled yet.</p></div>
          ) : (
            <div className="space-y-4">
              {meetings.map(meeting => (
                <div key={meeting.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-primary">
                  <div className="flex justify-between items-start mb-3">
                    <div><h3 className="text-lg font-bold text-gray-900">{meeting.title}</h3><p className="text-sm text-gray-600 mt-1">Board: {BOARDS.find(b => b.id === meeting.boardId)?.type}</p></div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(meeting.status)}`}>{meeting.status.toUpperCase()}</span>
                  </div>
                  <p className="text-gray-600 mb-3">{meeting.location}</p>
                  {meeting.description && <p className="text-gray-600 mb-3">{meeting.description}</p>}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">{new Date(meeting.scheduledAt).toLocaleString()}</div>
                    <div className="flex gap-2">
                      <select value={meeting.status} onChange={e => handleUpdateMeetingStatus(meeting.id, e.target.value as any)} className="text-sm px-3 py-1 border border-gray-300 rounded">
                        <option value="scheduled">Scheduled</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button onClick={() => { setSelectedMeetingToInvite(meeting.id); setShowSendInvite(true); }} className="px-3 py-1 text-blue-600 font-medium text-sm hover:bg-blue-50 rounded">Send Invite</button>
                      <button onClick={() => { setSelectedMeetingForMinutes(meeting.id); setShowSendMinutes(true); }} className="px-3 py-1 text-green-600 font-medium text-sm hover:bg-green-50 rounded">Send Minutes</button>
                      <button onClick={() => handleDeleteMeeting(meeting.id)} className="px-3 py-1 text-red-600 font-medium text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showSendInvite && selectedMeetingToInvite && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Send Meeting Invites</h2>
                <p className="text-gray-600 mb-4">Send invitation to {members.filter(m => m.boards.includes(meetings.find(mt => mt.id === selectedMeetingToInvite)?.boardId || '')).length} board members?</p>
                <div className="flex gap-2">
                  <button onClick={handleSendMeetingInvites} disabled={sendingEmail} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">{sendingEmail ? 'Sending...' : 'Send'}</button>
                  <button onClick={() => setShowSendInvite(false)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {showSendMinutes && selectedMeetingForMinutes && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4 my-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Meeting Minutes</h2>
                <textarea value={minutesSummary} onChange={e => setMinutesSummary(e.target.value)} placeholder="Meeting summary..." className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 h-24" />
                <textarea value={minutesDecisions} onChange={e => setMinutesDecisions(e.target.value)} placeholder="Key decisions (one per line)..." className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 h-20" />
                <textarea value={minutesNextSteps} onChange={e => setMinutesNextSteps(e.target.value)} placeholder="Next steps (one per line)..." className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 h-20" />
                <div className="flex gap-2">
                  <button onClick={handleSendMeetingMinutes} disabled={sendingEmail} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50">{sendingEmail ? 'Sending...' : 'Send Minutes'}</button>
                  <button onClick={() => setShowSendMinutes(false)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ACTION ITEMS VIEW
  if (showActionItemsView) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <button onClick={() => setShowActionItemsView(false)} className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold">← Back</button>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Action Items</h1>
          <button onClick={() => setShowAddActionItem(!showAddActionItem)} className="mb-8 px-6 py-2 bg-accent text-white rounded-lg font-semibold">{showAddActionItem ? 'Cancel' : 'Create Item'}</button>

          {showAddActionItem && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">New Action Item</h2>
              <input type="text" value={newActionTitle} onChange={e => setNewActionTitle(e.target.value)} placeholder="Title" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4" />
              <input type="text" value={newActionAssignee} onChange={e => setNewActionAssignee(e.target.value)} placeholder="Assigned to" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4" />
              <input type="date" value={newActionDueDate} onChange={e => setNewActionDueDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4" />
              <select value={newActionPriority} onChange={e => setNewActionPriority(e.target.value as any)} className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <select value={newActionBoardId} onChange={e => setNewActionBoardId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4">
                <option value="">Select Board</option>
                {BOARDS.map(b => <option key={b.id} value={b.id}>{b.type}</option>)}
              </select>
              <textarea value={newActionDescription} onChange={e => setNewActionDescription(e.target.value)} placeholder="Description" className="w-full px-4 py-2 border border-gray-300 rounded-lg h-20 mb-4" />
              <button onClick={handleAddActionItem} className="w-full px-6 py-2 bg-accent text-white rounded-lg font-semibold">Create</button>
            </div>
          )}

          {actionItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center"><p className="text-gray-600">No action items yet.</p></div>
          ) : (
            <div className="space-y-4">
              {actionItems.map(item => (
                <div key={item.id} className={`rounded-lg shadow p-6 border-l-4 ${getStatusColor(item.status)}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div><h3 className="text-lg font-bold text-gray-900">{item.title}</h3><p className="text-sm text-gray-600 mt-1">To: {item.assignedTo}</p></div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(item.priority)}`}>{item.priority.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-600">Due: {new Date(item.dueDate).toLocaleDateString()}</div>
                    <div className="flex gap-2">
                      <select value={item.status} onChange={e => handleUpdateActionItemStatus(item.id, e.target.value as any)} className="text-sm px-3 py-1 border border-gray-300 rounded">
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button onClick={() => handleDeleteActionItem(item.id)} className="px-3 py-1 text-red-600 font-medium">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">GovOps</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">Welcome to GovOps</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📅 Meetings</h3>
            <p className="text-gray-600 mb-4">{meetings.length} scheduled</p>
            <button onClick={() => setShowMeetingsView(true)} className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold">Schedule Meeting</button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">✓ Action Items</h3>
            <p className="text-gray-600 mb-4">{actionItems.length} open</p>
            <button onClick={() => setShowActionItemsView(true)} className="w-full px-4 py-2 bg-accent text-white rounded-lg font-semibold">Manage Items</button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">👥 Boards</h3>
            <p className="text-gray-600 mb-4">3 boards</p>
            <button onClick={() => setShowBoardsView(true)} className="w-full px-4 py-2 bg-secondary text-white rounded-lg font-semibold">View Boards</button>
          </div>
        </div>
      </div>
    </div>
  )
}
