'use client'

import { useState } from 'react'

const BOARDS = [
  {
    id: 'scab',
    name: 'Scientific & Clinical Advisory Board',
    type: 'SCAB',
    description: 'Scientific rigor and therapeutic validation',
    color: 'bg-blue-50 border-blue-200',
    members: [],
  },
  {
    id: 'boa',
    name: 'Board of Advisors',
    type: 'BOA',
    description: 'Capital formation, partnerships, positioning',
    color: 'bg-green-50 border-green-200',
    members: [],
  },
  {
    id: 'bod',
    name: 'Board of Directors',
    type: 'BOD',
    description: 'Governance and company direction',
    color: 'bg-purple-50 border-purple-200',
    members: [],
  },
]

export default function BoardsPage() {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [generatedAgenda, setGeneratedAgenda] = useState('')
  const [loading, setLoading] = useState(false)

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
      setGeneratedAgenda(result.agenda)
    } catch (error) {
      console.error('Error generating agenda:', error)
      alert('Failed to generate agenda')
    } finally {
      setLoading(false)
    }
  }

  const board = BOARDS.find(b => b.id === selectedBoard)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Boards</h1>
        <p className="text-gray-600 mb-12">Manage COARE governance boards</p>

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
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: generatedAgenda
                      .replace(/\n/g, '<br>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\n/g, '<li>$1</li>'),
                  }}
                />
                <button
                  onClick={() => alert('Meeting scheduled - Coming Soon!')}
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
                >
                  Schedule Meeting with This Agenda
                </button>
              </div>
            )}

            {/* Board Members */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                👥 Board Members
              </h3>
              {board.members.length === 0 ? (
                <p className="text-gray-600">No members yet. Add your first member to get started.</p>
              ) : (
                <div className="space-y-2">
                  {board.members.map((member: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
                      {member.name || member.email}
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => alert('Add Member - Coming Soon!')}
                className="mt-4 px-6 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 font-semibold transition"
              >
                Add Member
              </button>
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
