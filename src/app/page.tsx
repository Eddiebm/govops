'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
      <div className="text-center text-white px-6">
        <h1 className="text-5xl font-bold mb-4">GovOps</h1>
        <p className="text-xl mb-8 opacity-90">
          COARE Governance Operations Platform
        </p>
        <p className="text-lg mb-12 opacity-80 max-w-2xl mx-auto">
          Manage boards, meetings, agendas, action items, and keep everyone informed
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-8 py-3 bg-accent text-white font-bold rounded-lg hover:bg-opacity-90 transition"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-16 text-sm opacity-70">
          <p>Full-featured governance platform for COARE Holdings</p>
        </div>
      </div>
    </div>
  )
}
