'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/login')
        return
      }

      setUser(session.user)
      setLoading(false)
    }

    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
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
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upcoming Meetings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Meetings</h3>
            <p className="text-gray-600 mb-4">No meetings scheduled yet</p>
            <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 font-semibold">
              Schedule Meeting
            </button>
          </div>

          {/* Open Action Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Open Action Items</h3>
            <p className="text-gray-600 mb-4">No open action items</p>
            <button className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 font-semibold">
              Create Action Item
            </button>
          </div>

          {/* Boards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Boards</h3>
            <p className="text-gray-600 mb-4">Your boards appear here</p>
            <button className="w-full px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 font-semibold">
              View All Boards
            </button>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Getting Started</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3">1.</span>
              <span>Create your boards (SCAB, BOA, Executive)</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3">2.</span>
              <span>Add board members with appropriate roles</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3">3.</span>
              <span>Schedule your first meeting</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3">4.</span>
              <span>Create agenda and invite attendees</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary font-bold mr-3">5.</span>
              <span>Record meeting and track action items</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
