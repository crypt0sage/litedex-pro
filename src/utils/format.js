export function formatUSD(value, compact = false) {
  if (value === null || value === undefined || isNaN(value)) return '$0.00'
  const num = parseFloat(value)
  if (compact && Math.abs(num) >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (compact && Math.abs(num) >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  if (compact && Math.abs(num) >= 1e3) return `$${(num / 1e3).toFixed(1)}K`
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: num < 1 ? 6 : 2
  }).format(num)
}

export function formatToken(value, decimals = 4) {
  if (value === null || value === undefined || isNaN(value)) return '0'
  const num = parseFloat(value)
  if (Math.abs(num) >= 1e9) return `${(num / 1e9).toFixed(2)}B`
  if (Math.abs(num) >= 1e6) return `${(num / 1e6).toFixed(2)}M`
  if (Math.abs(num) >= 1e3) return num.toLocaleString('en-US', { maximumFractionDigits: 2 })
  return num.toLocaleString('en-US', { maximumFractionDigits: decimals })
}

export function formatPercent(value, showSign = true) {
  if (value === null || value === undefined || isNaN(value)) return '0.00%'
  const num = parseFloat(value)
  const sign = showSign && num > 0 ? '+' : ''
  return `${sign}${num.toFixed(2)}%`
}

export function shortenAddress(address, chars = 4) {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function formatHash(hash, chars = 6) {
  if (!hash) return ''
  return `${hash.slice(0, chars + 2)}...${hash.slice(-4)}`
}

export function formatTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = (now - date) / 1000
  if (diff < 60) return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return date.toLocaleDateString()
}

export function formatVolume(value) {
  return formatUSD(value, true)
}

export function formatAPR(value) {
  if (!value) return '0%'
  return `${parseFloat(value).toFixed(1)}%`
}
