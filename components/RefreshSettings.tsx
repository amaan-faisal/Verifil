'use client'

import { useState } from 'react'
import { Clock, Settings } from 'lucide-react'

interface RefreshSettingsProps {
  currentInterval: number
  onIntervalChange: (interval: number) => void
}

export default function RefreshSettings({ currentInterval, onIntervalChange }: RefreshSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const intervals = [
    { value: 30000, label: '30 seconds', short: '30s' },
    { value: 60000, label: '1 minute', short: '1m' },
    { value: 300000, label: '5 minutes', short: '5m' },
    { value: 600000, label: '10 minutes', short: '10m' },
    { value: 0, label: 'Manual only', short: 'Off' }
  ]
  
  const currentLabel = intervals.find(i => i.value === currentInterval)?.short || '1m'
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg hover:bg-muted/50"
        title="Refresh settings"
      >
        <Clock className="w-4 h-4" />
        <span>Auto-refresh: {currentLabel}</span>
        <Settings className="w-3 h-3" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Refresh Interval</div>
            {intervals.map((interval) => (
              <button
                key={interval.value}
                onClick={() => {
                  onIntervalChange(interval.value)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-2 py-2 text-sm rounded hover:bg-muted transition-colors ${
                  currentInterval === interval.value ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`}
              >
                {interval.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
