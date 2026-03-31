'use client'

import { useState } from 'react'

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

export default function BoardsPage() {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [generatedAgenda, setGeneratedAgenda] = useState('')
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [selectedBoardsForMember, setSelectedBoardsForMember] = useState<string[]>([])

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

  const handleAddMember = () => {
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
    alert(`${newMemberName} added to ${selectedBoardsForMember.length} board(s)`)
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId))
  }

  const handleToggleBoardForMember = (boardId: string) => {
    if (selectedBoardsForMember.includes(boardId)) {
      setSelectedBoardsForMember(selectedBoardsForMember.filter(b => b !== boardId))
    } else {
      setSelectedBoardsForMember([...selectedBoardsForMember, boardId])
    }
  }

  const board = BOARDS.find(b => b.id === selectedBoard)
  const boardMembers = selectedBoard 
    ? members.filter(m => m.boards.includes(selectedBoard))
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Boards</h1>
        <p className="text-gray-600 mb-12">Manage COARE governance boards and members</p>

        {/* Board Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {BOARDS.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBoard(b.id)}
              className={`p-6 rounded-lg border-2 text-left transition ${
                selectedBoard === b.id
                  ? `${b.color} border-opacity-100`
                  : `${b.color} border-opacity-50 hover:border-opacity-75`
              }`}
            >
              <h3 className="font-bold text-lg text-gray-900 mb-2">{b.type}</h3>
              <p className="text-sm text-gray-700 mb-2">{b.name}</p>
              <p className="text-xs text-gray-600">{b.description}</p>
            </button>
          ))}
        </div>

        {/* Selected Board Details */}
        {selectedBoard && board && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {board.name}
              </h2>
              <p className="text-gray-600">{board.description}</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
              <button className="px-4 py-2 border-b-2 border-primary text-primary font-semibold">
                Agenda Generator
              </button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Members ({boardMembers.length})
              </button>
            </div>

            {/* Note to Agenda Generator */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                📝 Generate Agenda from Notes
              </h3>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Enter meeting notes or discussion points..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              />
              <button
                onClick={handleGenerateAgenda}
                disabled={loading}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 font-semibold disabled:opacity-50 transition"
              >
                {loading ? 'Generating...' : 'Generate Agenda with AI'}
              </button>
            </div>

            {/* Generated Agenda */}
            {generatedAgenda && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  ✨ AI-Generated Agenda
                </h3>
                <div
                  className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap"
                >
                  {generatedAgenda}
                </div>
                <button
                  onClick={() => alert('Meeting scheduled - Coming Soon!')}
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
                >
                  Schedule Meeting with This Agenda
                </button>
              </div>
            )}

            {/* Board Members Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  👥 Board Members ({boardMembers.length})
                </h3>
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 font-semibold transition"
                >
                  {showAddMember ? 'Cancel' : 'Add Member'}
                </button>
              </div>

              {/* Add Member Form */}
              {showAddMember && (
                <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-4">Add New Member</h4>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={e => setNewMemberName(e.target.value)}
                      placeholder="Dr. John Smith"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={e => setNewMemberEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Assign to Board(s)
                    </label>
                    <div className="space-y-2">
                      {BOARDS.map(b => (
                        <label key={b.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedBoardsForMember.includes(b.id)}
                            onChange={() => handleToggleBoardForMember(b.id)}
                            className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                          />
                          <span className="ml-3 text-gray-700">{b.type} - {b.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAddMember}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 font-semibold transition"
                  >
                    Add Member
                  </button>
                </div>
              )}

              {/* Members List */}
              {boardMembers.length === 0 ? (
                <p className="text-gray-600">No members on this board yet.</p>
              ) : (
                <div className="space-y-3">
                  {boardMembers.map(member => (
                    <div key={member.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          On {member.boards.length} board{member.boards.length !== 1 ? 's' : ''}:
                          {' '}
                          {member.boards.map(bid => BOARDS.find(b => b.id === bid)?.type).join(', ')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedBoard && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">
              Select a board above to get started
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
// Trigger redeploy Tue Mar 31 17:00:55 UTC 2026
