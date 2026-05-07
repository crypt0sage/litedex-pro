import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, ChevronDown, Zap, ZapOff, AlertCircle, Copy, LogOut } from 'lucide-react'
import { useWallet } from '../context/WalletContext.jsx'
import { useLiteMode } from '../context/LiteModeContext.jsx'
import { shortenAddress } from '../utils/format.js'

const CHAINS = [
  { id: 1, name: 'LTC Mainnet', short: 'LTC', color: '#A6A6B0' },
  { id: 56, name: 'BSC', short: 'BSC', color: '#F0B90B' },
  { id: 1101, name: 'Ethereum', short: 'ETH', color: '#627EEA' },
]

function ChainBadge({ chainId, onClick }) {
  const chain = CHAINS.find(c => c.id === chainId) || CHAINS[0]
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-electric/30 transition-all text-sm font-heading font-600"
      style={{ background: 'rgba(8,15,30,0.8)' }}
    >
      <div className="w-2 h-2 rounded-full" style={{ background: chain.color, boxShadow: `0 0 6px ${chain.color}` }} />
      <span className="text-white">{chain.short}</span>
      <ChevronDown size={12} className="text-ltc" />
    </button>
  )
}

export default function Header() {
  const { connected, address, chainId, balance, connecting, connect, disconnect, switchChain } = useWallet()
  const { liteMode, toggleLiteMode } = useLiteMode()
  const [showWalletMenu, setShowWalletMenu] = useState(false)
  const [showChainMenu, setShowChainMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      })
    }
  }

  return (
    <header className="flex-shrink-0 h-14 flex items-center justify-between px-6 border-b border-white/5 z-10"
      style={{ background: 'rgba(4,8,18,0.95)', backdropFilter: 'blur(20px)' }}>

      {/* Left: page title placeholder / ticker */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 text-xs text-ltc font-mono">
          <span className="text-electric font-bold">LTC</span>
          <span className="text-white">$87.43</span>
          <span className="text-green-400">+3.21%</span>
          <span className="text-white/20 mx-1">|</span>
          <span className="text-yellow-400 font-bold">LDEX</span>
          <span className="text-white">$2.14</span>
          <span className="text-green-400">+12.34%</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Lite Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-ltc font-body hidden sm:block">Lite Mode</span>
          <button
            onClick={toggleLiteMode}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${liteMode ? 'bg-electric/80' : 'bg-white/10'}`}
            style={liteMode ? { boxShadow: '0 0 12px rgba(0,212,255,0.4)' } : {}}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center ${liteMode ? 'translate-x-5 bg-white' : 'bg-ltc/60'}`}>
              {liteMode ? <Zap size={10} className="text-electric" /> : <ZapOff size={10} className="text-white/40" />}
            </div>
          </button>
        </div>

        {/* Chain selector */}
        <div className="relative">
          <ChainBadge chainId={chainId || 1} onClick={() => setShowChainMenu(s => !s)} />
          {showChainMenu && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-44 glass-card rounded-xl overflow-hidden z-50"
            >
              {CHAINS.map(chain => (
                <button key={chain.id}
                  onClick={() => { switchChain(chain.id); setShowChainMenu(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-electric/10 transition-colors text-left">
                  <div className="w-2 h-2 rounded-full" style={{ background: chain.color }} />
                  <span className="text-white text-sm font-heading font-600">{chain.name}</span>
                  {(chainId || 1) === chain.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-electric" />}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Wallet button */}
        <div className="relative">
          {connected ? (
            <button
              onClick={() => setShowWalletMenu(s => !s)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-electric/30 bg-electric/10 hover:bg-electric/20 transition-all"
              style={{ boxShadow: '0 0 15px rgba(0,212,255,0.1)' }}
            >
              <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px #22c55e' }} />
              <span className="font-mono text-white text-xs">{shortenAddress(address)}</span>
              <ChevronDown size={12} className="text-ltc" />
            </button>
          ) : (
            <button
              onClick={connect}
              disabled={connecting}
              className="btn-primary flex items-center gap-2 px-4 py-1.5 rounded-xl text-white text-sm disabled:opacity-50"
            >
              <Wallet size={14} />
              <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}

          {showWalletMenu && connected && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl overflow-hidden z-50"
            >
              <div className="p-3 border-b border-white/5">
                <div className="text-xs text-ltc font-body mb-1">Connected Wallet</div>
                <div className="font-mono text-white text-xs break-all">{address}</div>
                {balance && (
                  <div className="mt-1 text-electric text-sm font-mono font-bold">{balance} LTC</div>
                )}
              </div>
              <button onClick={handleCopy}
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-electric/10 transition-colors text-left text-sm font-body text-ltc hover:text-white">
                <Copy size={14} />
                {copied ? 'Copied!' : 'Copy Address'}
              </button>
              <button onClick={() => { disconnect(); setShowWalletMenu(false) }}
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-red-500/10 transition-colors text-left text-sm font-body text-red-400">
                <LogOut size={14} />
                Disconnect
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showWalletMenu || showChainMenu) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowWalletMenu(false); setShowChainMenu(false) }} />
      )}
    </header>
  )
}
