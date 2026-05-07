import { useState, useEffect } from 'react'
import { MOCK_POOLS } from '../utils/mockData.js'

export function usePools() {
  const [pools, setPools] = useState(MOCK_POOLS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetchPools() {
      setLoading(true)
      try {
        const res = await fetch('/api/pools')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!cancelled && json.success && Array.isArray(json.data)) {
          setPools(json.data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setPools(MOCK_POOLS)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchPools()
    return () => { cancelled = true }
  }, [])

  return { pools, loading, error }
}
