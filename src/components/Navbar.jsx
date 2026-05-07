import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRightLeft, Droplets, BarChart3, Sprout, Bridge,
  Vote, Wallet, Cpu, ChevronLeft, ChevronRight,
  Twitter, Github, MessageCircle, ExternalLink
} from 'lucide-react'

const NAV_ITEMS = [
  { path: '/swap', label: 'Swap', icon: ArrowRightLeft },
  { path: '/liquidity', label: 'Liquidity', icon: Droplets },
  { path: '/trade', label: 'Trade', icon: BarChart3 },
  { path: '/farm', label: 'Farm', icon: Sprout },
  { path: '/bridge', label: 'Bridge', icon: Bridge },
  { path: '/governance', label: 'Governance', icon: Vote },
  { path: '/portfolio', label: 'Portfolio', icon: Wallet },
  { path: '/ai', label: 'AI Assistant', icon: Cpu },
]

function LiteDEXLogo({ collapsed }) {
  return (
    <div className="flex items-center gap-3 px-4 py-5">
      {/* Diamond logo mark */}
      <div className="relative flex-shrink-0" style={{ width: 36, height: 36 }}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#0066CC" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <polygon points="18,2 34,18 18,34 2,18" fill="url(#logoGrad)" filter="url(#glow)" opacity="0.9" />
          <polygon points="18,8 28,18 18,28 8,18" fill="#040812" />
          <polygon points="18,12 24,18 18,24 12,18" fill="url(#logoGrad)" opacity="0.7" />
          <text x="18" y="22" textAnchor="middle" fill="white" fontSize="9" fontFamily="Rajdhani" fontWeight="700">L</text>
        </svg>
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="font-heading font-bold text-white text-xl tracking-widest leading-none">
              LITE<span className="text-electric">DEX</span>
            </div>
            <div className="text-ltc text-xs font-body tracking-wider" style={{ fontSize: 9 }}>LITECOIN ECOSYSTEM</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar({ collapsed, setCollapsed }) {
  const location = useLocation()

  return (
    <motion.nav
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex-shrink-0 flex flex-col h-screen border-r border-white/5 overflow-hidden z-20"
      style={{ background: 'rgba(4,8,18,0.95)', backdropFilter: 'blur(20px)' }}
    >
      {/* Logo */}
      <LiteDEXLogo collapsed={collapsed} />

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute top-5 -right-3 w-6 h-6 rounded-full border border-electric/30 bg-bg-card flex items-center justify-center text-electric hover:bg-electric/20 transition-all z-30"
        style={{ boxShadow: '0 0 10px rgba(0,212,255,0.2)' }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Nav items */}
      <div className="flex-1 py-4 space-y-0.5 overflow-hidden">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path || (path === '/swap' && location.pathname === '/')
          return (
            <NavLink
              key={path}
              to={path}
              className={`relative flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive
                  ? 'nav-item-active'
                  : 'text-ltc hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon size={18} className={isActive ? 'text-electric' : 'text-ltc group-hover:text-white transition-colors'} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className={`font-heading font-600 text-sm tracking-wide whitespace-nowrap ${isActive ? 'text-electric' : ''}`}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute right-2 w-1.5 h-1.5 rounded-full bg-electric"
                  style={{ boxShadow: '0 0 6px #00D4FF' }}
                />
              )}
            </NavLink>
          )
        })}
      </div>

      {/* Divider + Social links */}
      <div className="border-t border-white/5 p-3">
        {!collapsed ? (
          <div className="flex items-center justify-around">
            {[
              { icon: Twitter, href: '#', label: 'Twitter' },
              { icon: Github, href: '#', label: 'GitHub' },
              { icon: MessageCircle, href: '#', label: 'Discord' },
              { icon: ExternalLink, href: '#', label: 'Docs' },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="p-2 text-ltc hover:text-electric transition-colors"
                title={label}>
                <Icon size={14} />
              </a>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="p-2 text-ltc hover:text-electric transition-colors"><Twitter size={14} /></a>
          </div>
        )}
        {!collapsed && (
          <div className="text-center mt-2">
            <span className="text-ltc/40 text-xs font-mono">v1.0.0</span>
          </div>
        )}
      </div>
    </motion.nav>
  )
}
