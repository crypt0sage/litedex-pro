import React, { useEffect, useRef, useState } from 'react'
import { createChart } from 'lightweight-charts'
import { generatePriceHistory } from '../utils/mockData.js'

const TIME_RANGES = [
  { label: '1H', interval: 'hour', count: 60 },
  { label: '4H', interval: '4hour', count: 96 },
  { label: '1D', interval: 'day', count: 30 },
  { label: '1W', interval: 'week', count: 52 },
]

export default function PriceChart({ symbol = 'LTC', basePrice = 87.43, type = 'candlestick', height = 400 }) {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)
  const seriesRef = useRef(null)
  const [range, setRange] = useState('1D')
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/price/${symbol}`)
        if (!res.ok) throw new Error('API error')
        const json = await res.json()
        if (json.success && json.data.history) {
          setChartData(json.data.history)
          return
        }
      } catch (e) {}
      setChartData(generatePriceHistory(basePrice, 100))
    }
    fetchData()
  }, [symbol, basePrice])

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#040812' },
        textColor: '#A6A6B0',
      },
      grid: {
        vertLines: { color: '#0D1829' },
        horzLines: { color: '#0D1829' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: 'rgba(0,212,255,0.4)', width: 1, style: 1 },
        horzLine: { color: 'rgba(0,212,255,0.4)', width: 1, style: 1 },
      },
      rightPriceScale: {
        borderColor: '#0D1829',
        textColor: '#A6A6B0',
      },
      timeScale: {
        borderColor: '#0D1829',
        textColor: '#A6A6B0',
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height,
    })

    chartRef.current = chart

    let series
    if (type === 'area') {
      series = chart.addAreaSeries({
        lineColor: '#00D4FF',
        topColor: 'rgba(0,212,255,0.2)',
        bottomColor: 'rgba(0,212,255,0.0)',
        lineWidth: 2,
        crosshairMarkerBackgroundColor: '#00D4FF',
      })
    } else {
      series = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderUpColor: '#22c55e',
        borderDownColor: '#ef4444',
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      })
    }

    seriesRef.current = series

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [type, height])

  useEffect(() => {
    if (!seriesRef.current || !chartData) return
    try {
      const sorted = [...chartData].sort((a, b) => a.time - b.time)
      if (type === 'area') {
        seriesRef.current.setData(sorted.map(d => ({ time: d.time, value: d.value || d.close })))
      } else {
        seriesRef.current.setData(sorted.map(d => ({
          time: d.time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close
        })))
      }
      chartRef.current?.timeScale().fitContent()
    } catch (e) {
      console.error('Chart data error:', e)
    }
  }, [chartData, type])

  return (
    <div className="w-full">
      <div className="flex gap-1 mb-3">
        {TIME_RANGES.map(r => (
          <button
            key={r.label}
            onClick={() => setRange(r.label)}
            className={`px-3 py-1 rounded text-xs font-heading font-600 transition-all ${
              range === r.label
                ? 'bg-electric text-bg-deep'
                : 'text-ltc hover:text-white hover:bg-white/5'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div ref={chartContainerRef} style={{ width: '100%', height }} />
    </div>
  )
}
