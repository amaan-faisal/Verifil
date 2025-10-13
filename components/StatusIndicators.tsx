'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, DollarSign, Zap } from 'lucide-react'

interface StatusIndicatorsProps {
  wallets: any[]
  lastSyncTime?: Date
}

export default function StatusIndicators({ wallets, lastSyncTime }: StatusIndicatorsProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [taxProgress, setTaxProgress] = useState(0)
  const [earningsAvailable, setEarningsAvailable] = useState(0)

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

  return (
    <div className="mb-8 space-y-4">
      {/* Live Data Indicator */}
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Zap className="w-4 h-4 text-green-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <span className="text-sm font-medium text-green-400">Live Data</span>
        </div>
        {lastSyncTime && (
          <div className="text-xs text-muted-foreground ml-auto">
            Updated {formatLastSync(lastSyncTime)}
          </div>
        )}
      </div>

      {/* Tax Progress */}
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-400">{currentYear} Taxes in progress</span>
        </div>
        <div className="ml-auto">
          <div className="text-xs text-muted-foreground mb-1">{taxProgress}% complete</div>
          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${taxProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Earnings Available */}
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-400">Earn up to ${earningsAvailable}</span>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">
          Available
        </div>
      </div>
    </div>
  )
}