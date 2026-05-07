import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, CheckCircle } from 'lucide-react'
import { useTokens } from '../hooks/useTokens.js'
import { useSwapQuote } from '../hooks/useSwapQuote.js'
import { formatUSD, formatToken } from '../utils/format.js'
import TokenSelector, { TokenIcon } from './TokenSelector.jsx'
import GlassCard from './GlassCard.jsx'

export default function LiteModeSwap() {
  const { tokens } = useTokens()
  const [tokenIn, setTokenIn] = useState(tokens[0] || null)
  const [tokenOut, setTokenOut] = useState(tokens[2] || null)
  const [amountIn, setAmountIn] = useState('')
  const [swapped, setSwapped] = useState(false)

  const { quote, loading } = useSwapQuote({
    tokenIn: tokenIn?.symbol,
    tokenOut: tokenOut?.symbol,
    amountIn,
    slippage: 0.5
  })

  const handleSwap = () => {
    setSwapped(true)
    setTimeout(() => setSwapped(false), 2500)
    setAmountIn('')
  }

  return (
    <div className="max-w-sm mx-auto">
      <GlassCard glow className="p-6">
        <h2 className="font-heading font-bold text-white text-2xl tracking-wide mb-2 text-center">
          QUICK SWAP
        </h2>
        <p className="text-ltc text-sm text-center font-body mb-6">Simple, fast, no fuss</p>

        {swapped ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-8 text-center"
          >
            <CheckCircle size={48} className="text-green-400 mx-auto mb-3" style={{ filter: 'drop-shadow(0 0 12px #22c55e)' }} />
            <div className="font-heading font-bold text-white text-xl">Swap Submitted!</div>
            <div className="text-ltc text-sm font-body mt-1">Your transaction is processing...</div>
          </motion.div>
        ) : (
          <>
            {/* From token */}
            <div className="token-input rounded-xl p-4 mb-2">
              <div className="flex justify-between mb-2">
                <span className="text-ltc text-xs font-body">From</span>
                <span className="text-ltc text-xs font-body">Balance: 247.3 {tokenIn?.symbol}</span>
              </div>
              <div className="flex items-center gap-3">
                <TokenSelector
                  selected={tokenIn}
                  onSelect={setTokenIn}
                  exclude={tokenOut?.symbol}
                />
                <input
                  type="number"
                  value={amountIn}
                  onChange={e => setAmountIn(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-white text-2xl font-mono text-right outline-none placeholder-white/20"
                />
              </div>
              {amountIn && tokenIn && (
                <div className="text-right text-ltc text-xs font-mono mt-1">
                  ≈ {formatUSD(parseFloat(amountIn) * (tokenIn.price || 87))}
                </div>
              )}
            </div>

            {/* Swap arrow */}
            <div className="flex justify-center my-2">
              <button
                onClick={() => { const t = tokenIn; setTokenIn(tokenOut); setTokenOut(t) }}
                className="w-10 h-10 rounded-full border border-electric/30 bg-bg-card flex items-center justify-center text-electric hover:bg-electric/20 hover:scale-110 transition-all"
                style={{ boxShadow: '0 0 15px rgba(0,212,255,0.2)' }}
              >
                <ArrowDown size={18} />
              </button>
            </div>

            {/* To token */}
            <div className="token-input rounded-xl p-4 mb-5">
              <div className="flex justify-between mb-2">
                <span className="text-ltc text-xs font-body">To</span>
              </div>
              <div className="flex items-center gap-3">
                <TokenSelector
                  selected={tokenOut}
                  onSelect={setTokenOut}
                  exclude={tokenIn?.symbol}
                  label="Select"
                />
                <div className="flex-1 text-right">
                  {loading ? (
                    <div className="h-8 bg-white/5 rounded animate-pulse w-24 ml-auto" />
                  ) : (
                    <div className="text-2xl font-mono text-white">
                      {quote ? formatToken(parseFloat(quote.amountOut)) : '—'}
                    </div>
                  )}
                  {quote && tokenOut && (
                    <div className="text-ltc text-xs font-mono">
                      ≈ {formatUSD(parseFloat(quote.amountOut) * (tokenOut.price || 1))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleSwap}
              disabled={!amountIn || !tokenIn || !tokenOut || loading}
              className="btn-primary w-full py-4 rounded-xl text-white text-lg tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'GETTING QUOTE...' : 'SWAP NOW'}
            </button>

            {quote && (
              <div className="mt-3 text-center text-ltc text-xs font-body">
                Rate: 1 {tokenIn?.symbol} ≈ {formatToken(parseFloat(quote.amountOut) / parseFloat(amountIn))} {tokenOut?.symbol}
              </div>
            )}
          </>
        )}
      </GlassCard>
    </div>
  )
}
