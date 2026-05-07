import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRightLeft, Plus, Minus, Zap } from 'lucide-react'
import { MOCK_TRANSACTIONS } from '../utils/mockData.js'
import { formatHash, formatTime } from '../utils/format.js'

const TYPE_CONFIG = {
  'Swap': { color: 'text-electric', bg: 'bg-electric/10', icon: ArrowRightLeft },
  'Add Liquidity': { color: 'text-green-400', bg: 'bg-green-400/10', icon: Plus },
  'Remove Liquidity': { color: 'text-red-400', bg: 'bg-red-400/10', icon: Minus },
  'Farm': { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Zap },
}

export default function TransactionFeed({ compact = false }) {
  const [txs, setTxs] = useState(MOCK_TRANSACTIONS)
  const [newTx, setNewTx] = useState(null)

  useEffect(() => {
    async function fetchTxs() {
      try {
        const res = await fetch('/api/transactions/recent')
        if (!res.ok) throw new Error('API error')
        const json = await res.json()
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setTxs(json.data)
        }
      } catch (e) {
        setTxs(MOCK_TRANSACTIONS)
      }
    }
    fetchTxs()
    const interval = setInterval(fetchTxs, 10000)
    return () => clearInterval(interval)
  }, [])

  if (compact) {
    return (
      <div className="space-y-2">
        <AnimatePresence>
          {txs.slice(0, 5).map((tx, i) => {
            const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG['Swap']
            const Icon = cfg.icon
            return (
              <motion.div key={tx.hash}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 py-2 border-b border-white/5 last:border-0">
                <div className={`p-1.5 rounded-lg ${cfg.bg}`}>
                  <Icon size={12} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-heading font-600 ${cfg.color}`}>{tx.type}</span>
                    <span className="text-xs text-ltc truncate">{tx.pair}</span>
                  </div>
                  <div className="text-xs text-white/40 font-mono">{formatHash(tx.hash)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-white">{tx.amountOut}</div>
                  <div className="text-xs text-ltc/60">{formatTime(tx.time)}</div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            {['Type', 'Pair', 'Amount In', 'Amount Out', 'Time', 'Wallet'].map(h => (
              <th key={h} className="text-left text-xs text-ltc font-heading tracking-widest py-2 px-3">{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {txs.map((tx, i) => {
              const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG['Swap']
              const Icon = cfg.icon
              return (
                <motion.tr key={tx.hash}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-heading font-600 px-2 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>
                      <Icon size={10} />
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-heading font-600 text-white">{tx.pair}</td>
                  <td className="py-3 px-3 font-mono text-ltc">{tx.amountIn}</td>
                  <td className="py-3 px-3 font-mono text-white">{tx.amountOut}</td>
                  <td className="py-3 px-3 text-ltc/60 text-xs font-body">{formatTime(tx.time)}</td>
                  <td className="py-3 px-3 font-mono text-electric/70 text-xs">{tx.wallet}</td>
                </motion.tr>
              )
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}
