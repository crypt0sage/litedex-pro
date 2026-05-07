import React, { createContext, useContext, useState, useEffect } from 'react'

const LiteModeContext = createContext(null)

export function LiteModeProvider({ children }) {
  const [liteMode, setLiteMode] = useState(() => {
    try {
      return localStorage.getItem('litedex_litemode') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('litedex_litemode', String(liteMode))
    } catch (e) {}
  }, [liteMode])

  const toggleLiteMode = () => setLiteMode(prev => !prev)

  return (
    <LiteModeContext.Provider value={{ liteMode, toggleLiteMode }}>
      {children}
    </LiteModeContext.Provider>
  )
}

export function useLiteMode() {
  const ctx = useContext(LiteModeContext)
  if (!ctx) throw new Error('useLiteMode must be used within LiteModeProvider')
  return ctx
}
