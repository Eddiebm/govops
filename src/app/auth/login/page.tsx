'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('eddie@coare.io')
  const [password, setPassword] = useState('demo')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Demo login - no database needed
    if (email && password) {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 500))
      router.push('/dashboard')
    } else {
      setError('Please enter email and password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-primary mb-2 text-center">
          GovOps
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          Governance Operations Platform
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="eddie@coare.io"
            />
            <p className="text-xs text-gray-500 mt-1">Demo: use any email</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">Demo: any password</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Demo mode - no database required
        </p>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
          <p className="font-semibold mb-2">Demo Account:</p>
          <p>Email: eddie@coare.io (or any)</p>
          <p>Password: demo (or any)</p>
        </div>
      </div>
    </div>
  )
}
