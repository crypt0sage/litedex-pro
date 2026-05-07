import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronDown, Star } from 'lucide-react'
import { useTokens } from '../hooks/useTokens.js'
import { formatToken, formatUSD } from '../utils/format.js'

const RECENT_SYMBOLS = ['LTC', 'USDT', 'ETH']

function TokenIcon({ token, size = 32 }) {
  const [imgErr, setImgErr] = useState(false)
  if (token.logoUrl && !imgErr) {
    return (
      <img
        src={token.logoUrl}
        alt={token.symbol}
        width={size}
        height={size}
        className="rounded-full"
        onError={() => setImgErr(true)}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    )
  }
  const colors = { LTC: '#B8B8B8', ETH: '#627EEA', BTC: '#F7931A', USDT: '#26A17B', USDC: '#2775CA', LDEX: '#00D4FF' }
  const bg = colors[token.symbol] || '#00D4FF'
  return (
    <div className="rounded-full flex items-center justify-center font-heading font-bold text-white text-xs"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.32 }}>
      {token.symbol.slice(0, 2)}
    </div>
  )
}

export { TokenIcon }

export default function TokenSelector({ selected, onSelect, exclude = [], label = 'Select token', className = '' }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { tokens } = useTokens()

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return tokens.filter(t =>
      t.symbol !== exclude &&
      (t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q))
    )
  }, [tokens, search, exclude])

  const recent = tokens.filter(t => RECENT_SYMBOLS.includes(t.symbol) && t.symbol !== exclude)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl btn-secondary text-sm font-heading font-600 ${className}`}
      >
        {selected ? (
          <>
            <TokenIcon token={selected} size={22} />
            <span className="font-heading font-bold text-white">{selected.symbol}</span>
          </>
        ) : (
          <span className="text-ltc">{label}</span>
        )}
        <ChevronDown size={14} className="text-ltc ml-1" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(4,8,18,0.85)', backdropFilter: 'blur(6px)' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="glass-card rounded-2xl w-full max-w-md"
              style={{ maxHeight: '80vh' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <h3 className="font-heading font-bold text-white text-lg tracking-wide">SELECT TOKEN</h3>
                <button onClick={() => setOpen(false)} className="text-ltc hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4">
                <div className="relative token-input rounded-xl flex items-center gap-2 px-3 py-2">
                  <Search size={16} className="text-ltc flex-shrink-0" />
                  <input
                    autoFocus
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or symbol..."
                    className="bg-transparent text-white text-sm w-full outline-none font-body placeholder-ltc/50"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="text-ltc hover:text-white">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {!search && recent.length > 0 && (
                <div className="px-4 pb-3">
                  <div className="text-ltc text-xs font-heading mb-2 tracking-widest">RECENT</div>
                  <div className="flex gap-2 flex-wrap">
                    {recent.map(t => (
                      <button key={t.id} onClick={() => { onSelect(t); setOpen(false); setSearch('') }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-electric/30 bg-white/5 hover:bg-electric/10 transition-all text-sm font-heading font-600 text-white">
                        <TokenIcon token={t} size={18} />
                        {t.symbol}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
                {filtered.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { onSelect(t); setOpen(false); setSearch('') }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-electric/5 transition-colors border-b border-white/5 last:border-0"
                  >
                    <TokenIcon token={t} size={36} />
                    <div className="flex-1 text-left">
                      <div className="font-heading font-bold text-white text-sm">{t.symbol}</div>
                      <div className="text-ltc text-xs font-body">{t.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-white text-sm">{formatUSD(t.price)}</div>
                      <div className={`text-xs font-mono ${t.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {t.change24h >= 0 ? '+' : ''}{t.change24h?.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="p-8 text-center text-ltc font-body text-sm">No tokens found</div>
                )}
              </div>

              <div className="p-3 border-t border-white/5 text-center">
                <button className="text-electric text-xs font-body hover:underline">Manage Token Lists</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
