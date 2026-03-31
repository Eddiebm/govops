'use client'

import { useState } from 'react'
import { mockData } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const user = mockData.users[0]

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">You've been logged out</h1>
          <Link href="/" className="text-lg underline hover:opacity-80">
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">GovOps</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user.email}</span>
            <span className="text-sm bg-secondary text-white px-3 py-1 rounded-full">{user.role}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.full_name}</h2>
          <p className="text-gray-600">Manage boards, meetings, and action items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Upcoming Meetings */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📅 Upcoming Meetings</h3>
            <p className="text-gray-600 mb-4 text-sm">{mockData.meetings.length} scheduled</p>
            <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 font-semibold transition">
              Schedule Meeting
            </button>
          </div>

          {/* Open Action Items */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-900 mb-4">✓ Action Items</h3>
            <p className="text-gray-600 mb-4 text-sm">{mockData.actionItems.length} open</p>
            <button className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 font-semibold transition">
              Create Action Item
            </button>
          </div>

          {/* Boards */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-900 mb-4">👥 Boards</h3>
            <p className="text-gray-600 mb-4 text-sm">{mockData.boards.length} boards</p>
            <button className="w-full px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 font-semibold transition">
              View Boards
            </button>
          </div>
        </div>

        {/* Boards Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Your Boards</h3>
          <div className="space-y-4">
            {mockData.boards.map((board) => (
              <div key={board.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{board.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{board.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Cadence: {board.meeting_cadence}</p>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                    {board.board_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">🚀 Quick Start</h3>
          <ol className="space-y-4">
            <li className="flex items-start">
              <span className="font-bold mr-4 text-lg">1.</span>
              <span>Schedule your first board meeting</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-4 text-lg">2.</span>
              <span>Create an agenda with discussion topics</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-4 text-lg">3.</span>
              <span>Invite board members (auto-sends email)</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-4 text-lg">4.</span>
              <span>Record the meeting and track action items</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-4 text-lg">5.</span>
              <span>Auto-transcribe and distribute minutes</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
