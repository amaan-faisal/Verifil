import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string, start = 6, end = 4): string {
  if (!address) return ''
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export function formatValue(value: number, decimals = 2): string {
  if (value === 0) return '$0.00'
  if (value < 0.01) return '<$0.01'
  return `$${value.toFixed(decimals)}`
}

export function formatNumber(value: number, decimals = 2): string {
  if (value === 0) return '0'
  if (value < 0.01) return '<0.01'
  return value.toFixed(decimals)
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now() / 1000
  const diff = now - timestamp
  
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`
  return `${Math.floor(diff / 2592000)} months ago`
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'SAFE':
      return 'text-green-400'
    case 'LOW':
      return 'text-yellow-400'
    case 'MEDIUM':
      return 'text-orange-400'
    case 'HIGH':
      return 'text-red-400'
    case 'CRITICAL':
      return 'text-red-600'
    default:
      return 'text-muted-foreground'
  }
}

export function getRiskBgColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'SAFE':
      return 'bg-green-400/10 border-green-400/20'
    case 'LOW':
      return 'bg-yellow-400/10 border-yellow-400/20'
    case 'MEDIUM':
      return 'bg-orange-400/10 border-orange-400/20'
    case 'HIGH':
      return 'bg-red-400/10 border-red-400/20'
    case 'CRITICAL':
      return 'bg-red-600/10 border-red-600/20'
    default:
      return 'bg-muted/10 border-muted/20'
  }
}

