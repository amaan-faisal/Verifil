'use client'

import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import Image from 'next/image'

interface StatusIndicatorsProps {
  wallets: any[]
  lastSyncTime?: Date
}

export default function StatusIndicators({ wallets, lastSyncTime }: StatusIndicatorsProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [taxProgress, setTaxProgress] = useState(0)
  const [earningsAvailable, setEarningsAvailable] = useState(0)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Check if animation has already been shown in this session
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const hasAnimated = sessionStorage.getItem('statusIndicatorsAnimated')
      if (!hasAnimated) {
        // Use requestAnimationFrame to ensure the animation triggers when class is added
        requestAnimationFrame(() => {
          setShouldAnimate(true)
          sessionStorage.setItem('statusIndicatorsAnimated', 'true')
        })
      }
    }
  }, [])

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Calculate tax progress based on transaction count (standardized)
  useEffect(() => {
    const totalTransactions = wallets.reduce((sum, wallet) => {
      return sum + (wallet.transaction_count || 0)
    }, 0)
    
    // Tax progress: normalized across app (every 10 tx = 1%)
    const progress = Math.min(100, Math.floor(totalTransactions / 10))
    setTaxProgress(progress)
  }, [wallets])

  // Calculate available earnings based on wallet activity
  useEffect(() => {
    const totalValue = wallets.reduce((sum, wallet) => {
      return sum + (wallet.total_portfolio_value_usd || 0)
    }, 0)
    
    // Earnings: $0-500 based on portfolio value
    const earnings = Math.min(500, Math.floor(totalValue / 1000))
    setEarningsAvailable(earnings)
  }, [wallets])

  // Format last sync time
  const formatLastSync = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Get current year dynamically
  const currentYear = new Date().getFullYear()

  // Only show animation on first mount if not already animated
  const animationClass = mounted && shouldAnimate ? 'animate-fade-in' : ''

  return (
    <div className="mb-8 space-y-4">
      {/* Live Data Indicator */}
      <div className={`flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/10 rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-green-500/10 hover:opacity-100 opacity-90 transition-all duration-500 ease-in-out cursor-pointer group ${animationClass}`}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Zap className="w-4 h-4 text-green-300 group-hover:text-green-200 group-hover:scale-110 transition-all duration-500 ease-in-out" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-300/60 rounded-full animate-pulse group-hover:animate-bounce group-hover:opacity-80 transition-opacity duration-500"></div>
          </div>
          <span className="text-sm font-medium text-green-300 group-hover:text-green-200 transition-all duration-500 ease-in-out">Live Data</span>
        </div>
        {lastSyncTime && (
          <div className="text-xs text-muted-foreground ml-auto group-hover:opacity-80 transition-opacity duration-500">
            Updated {formatLastSync(lastSyncTime)}
          </div>
        )}
      </div>


    </div>
  )
}