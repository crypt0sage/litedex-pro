import { useState, useEffect } from 'react'
import { MOCK_TOKENS } from '../utils/mockData.js'

export function useTokens() {
  const [tokens, setTokens] = useState(MOCK_TOKENS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetchTokens() {
      setLoading(true)
      try {
        const res = await fetch('/api/tokens')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!cancelled && json.success && Array.isArray(json.data)) {
          setTokens(json.data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setTokens(MOCK_TOKENS)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchTokens()
    return () => { cancelled = true }
  }, [])

  return { tokens, loading, error }
}
