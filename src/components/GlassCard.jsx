import React from 'react'

export default function GlassCard({ children, className = '', glow = false, hover = true, onClick, style }) {
  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${glow ? 'glow-border' : 'glass-card'} ${hover ? 'hover:border-electric/30' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  )
}
