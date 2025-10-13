'use client'

import { useState, useEffect, useRef } from 'react'
import { Wallet, Trash2, MoreVertical, AlertCircle } from 'lucide-react'

interface WalletCardProps {
  wallet: {
    address: string
    total_portfolio_value_usd: number
    holdings_count: number
    eth_balance: number
    // add any needed fields
  }
  isSelected: boolean
  onClick: () => void
  onDelete?: (address: string) => void
  isEmpty?: boolean
}

export default function WalletCard({ wallet, isSelected, onClick, onDelete, isEmpty }: WalletCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatValue = (value: number) => {
    if (value === 0) return '$0.00'
    if (value < 0.01) return '<$0.01'
    return `$${value.toFixed(2)}`
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(wallet.address)
    }
    setShowDeleteConfirm(false)
    setShowMenu(false)
  }

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMenu(true)
  }

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onContextMenu={handleRightClick}
        className={`group w-full p-4 rounded-xl border transition-all duration-200 text-left relative hover:shadow-lg ${
          isSelected
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 shadow-lg'
            : isEmpty
              ? 'bg-muted/50 border-border/50 opacity-60 text-muted-foreground hover:bg-muted/70'
              : 'bg-card/50 border-border/50 hover:bg-gradient-to-r hover:from-card hover:to-card/80 hover:border-border hover:shadow-md'
        }`}
        disabled={isEmpty}
        tabIndex={isEmpty ? -1 : 0}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all duration-200 ${
            isSelected 
              ? 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/25' 
              : 'bg-gradient-to-br from-orange-500 to-orange-600 group-hover:shadow-orange-500/20'
          }`}>
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm mb-1">
              Ethereum Wallet {formatAddress(wallet.address)}
            </div>
            <div className="text-sm text-muted-foreground mb-1">
              <span className="font-medium text-foreground">{formatValue(wallet.total_portfolio_value_usd)}</span>
              <span className="mx-2">•</span>
              <span>{wallet.holdings_count} asset{wallet.holdings_count !== 1 ? 's' : ''}</span>
            </div>
            <div className="text-xs text-muted-foreground/70">
              Last updated 4 hours ago
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200" title="Right-click for options">
            <MoreVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </div>
        </div>
        {/* Empty wallet badge */}
        {isEmpty && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/80 border border-border/50 text-xs text-muted-foreground backdrop-blur-sm">
            <AlertCircle className="w-3 h-3" /> Empty
          </div>
        )}
      </button>

      {/* Right-click Context Menu */}
      {showMenu && (
        <div ref={menuRef} className="absolute top-0 right-0 z-50 bg-card border border-border rounded-lg shadow-lg p-2 min-w-[120px]">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowDeleteConfirm(true)
              setShowMenu(false)
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Wallet
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Wallet</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this wallet? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
