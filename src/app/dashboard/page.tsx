'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useFirebaseAuth'
import { useFirestore } from '@/hooks/useFirestore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, logOut, loading: authLoading } = useAuth()
  const { data: boards } = useFirestore('boards')
  const { data: meetings } = useFirestore('meetings')
  const { data: actionItems } = useFirestore('actionItems')
  const router = useRouter()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    } else if (!authLoading && user) {
      setIsInitialized(true)
    }
  }, [user, authLoading, router])

  const handleLogout = async () => {
    await logOut()
    router.push('/auth/login')
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">GovOps</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.email}</span>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to GovOps</h2>
          <p className="text-gray-600">Manage boards, meetings, and action items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Upcoming Meetings */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📅 Upcoming Meetings</h3>
            <p className="text-gray-600 mb-4 text-sm">{meetings.length} scheduled</p>
            <button onClick={() => alert('Schedule Meeting - Coming Soon')} className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 font-semibold transition cursor-pointer">
              Schedule Meeting
            </button>
          </div>

          {/* Open Action Items */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-900 mb-4">✓ Action Items</h3>
            <p className="text-gray-600 mb-4 text-sm">{actionItems.length} open</p>
            <button onClick={() => alert('Create Action Item - Coming Soon')} className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 font-semibold transition cursor-pointer">
              Create Action Item
            </button>
          </div>

          {/* Boards */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-900 mb-4">👥 Boards</h3>
            <p className="text-gray-600 mb-4 text-sm">{boards.length} boards</p>
            <Link href="/boards" className="inline-block w-full">
              <button className="w-full px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 font-semibold transition cursor-pointer">
                View Boards
              </button>
            </Link>
          </div>
        </div>

        {/* Boards Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Your Boards</h3>
          {boards.length === 0 ? (
            <p className="text-gray-600">No boards yet. Create one to get started.</p>
          ) : (
            <div className="space-y-4">
              {boards.map((board: any) => (
                <div key={board.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900">{board.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{board.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Cadence: {board.meeting_cadence || 'Not set'}</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                      {board.board_type || 'BOARD'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Start */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">🚀 Getting Started</h3>
          <ol className="space-y-4">
            <li className="flex items-start">
              <span className="font-bold mr-4 text-lg">1.</span>
              <span>Create your first board (SCAB, BOA, or custom)</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-4 text-lg">2.</span>
              <span>Add board members with roles</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-4 text-lg">3.</span>
              <span>Schedule your first meeting</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-4 text-lg">4.</span>
              <span>Create agenda and invite attendees</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-4 text-lg">5.</span>
              <span>Record, transcribe, and track action items</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
// Redeploy trigger Tue Mar 31 16:51:27 UTC 2026
// Force redeploy 1774977472
