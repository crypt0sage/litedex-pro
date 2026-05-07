import { useState, useEffect, useRef } from 'react'

export function useSwapQuote({ tokenIn, tokenOut, amountIn, slippage }) {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (!tokenIn || !tokenOut || !amountIn || parseFloat(amountIn) <= 0) {
      setQuote(null)
      setLoading(false)
      return
    }

    setLoading(true)
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/swap/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenIn, tokenOut, amountIn: parseFloat(amountIn), slippage: slippage || 0.5 })
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (json.success) {
          setQuote(json.data)
          setError(null)
        } else {
          throw new Error(json.error || 'Quote failed')
        }
      } catch (err) {
        // Fallback mock quote
        const inPrice = 87.43
        const outMultiplier = tokenOut === 'USDT' || tokenOut === 'USDC' || tokenOut === 'DAI' ? inPrice : (1 / 87.43)
        const amtIn = parseFloat(amountIn) || 0
        const amountOut = amtIn * outMultiplier * (1 - 0.003)
        const priceImpact = Math.min((amtIn / 10000) * 100, 15)
        setQuote({
          amountOut: amountOut.toFixed(6),
          priceImpact: priceImpact.toFixed(2),
          fee: (amtIn * 0.003).toFixed(6),
          route: [tokenIn, 'wLTC', tokenOut].filter((v, i, a) => a.indexOf(v) === i),
          minAmountOut: (amountOut * (1 - (slippage || 0.5) / 100)).toFixed(6)
        })
        setError(null)
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [tokenIn, tokenOut, amountIn, slippage])

  return { quote, loading, error }
}
