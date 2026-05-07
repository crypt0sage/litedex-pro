import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const WalletContext = createContext(null)

const MOCK_ADDRESS = '0x742d35Cc6634C0532925a3b8D4C9B8A2f5Dace00'
const MOCK_BALANCE = '1,247.83'

export function WalletProvider({ children }) {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [balance, setBalance] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('litedex_wallet')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.connected && data.address) {
          setConnected(true)
          setAddress(data.address)
          setChainId(data.chainId || 1)
          setBalance(MOCK_BALANCE)
        }
      } catch (e) {
        localStorage.removeItem('litedex_wallet')
      }
    }
  }, [])

  const connect = useCallback(async () => {
    setConnecting(true)
    setError(null)
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' })
        const addr = accounts[0]
        const chain = parseInt(chainIdHex, 16)
        setAddress(addr)
        setChainId(chain)
        setBalance(MOCK_BALANCE)
        setConnected(true)
        localStorage.setItem('litedex_wallet', JSON.stringify({ connected: true, address: addr, chainId: chain }))
      } else {
        // Mock wallet fallback
        await new Promise(r => setTimeout(r, 800))
        setAddress(MOCK_ADDRESS)
        setChainId(1)
        setBalance(MOCK_BALANCE)
        setConnected(true)
        localStorage.setItem('litedex_wallet', JSON.stringify({ connected: true, address: MOCK_ADDRESS, chainId: 1 }))
      }
    } catch (err) {
      setError(err.message || 'Failed to connect wallet')
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setConnected(false)
    setAddress(null)
    setChainId(null)
    setBalance(null)
    localStorage.removeItem('litedex_wallet')
  }, [])

  const switchChain = useCallback(async (newChainId) => {
    setChainId(newChainId)
    if (connected) {
      const stored = localStorage.getItem('litedex_wallet')
      if (stored) {
        try {
          const data = JSON.parse(stored)
          localStorage.setItem('litedex_wallet', JSON.stringify({ ...data, chainId: newChainId }))
        } catch (e) {}
      }
    }
  }, [connected])

  return (
    <WalletContext.Provider value={{
      connected,
      address,
      chainId,
      balance,
      connecting,
      error,
      connect,
      disconnect,
      switchChain
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
