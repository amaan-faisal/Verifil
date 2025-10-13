'use client'

import { useState } from 'react'
import { X, Wallet } from 'lucide-react'

interface AddWalletModalProps {
  onClose: () => void
  onAdd: (address: string, resolve: () => void, reject: (err: Error) => void) => void
}

export default function AddWalletModal({ onClose, onAdd }: AddWalletModalProps) {
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.trim()) return
    setIsLoading(true)
    setError('')
    await new Promise<void>((resolve, reject) => {
      onAdd(address.trim(), () => {
        setIsLoading(false)
        setError('');
        onClose();
        resolve();
      }, (err) => {
        setIsLoading(false);
        setError(err.message || 'Failed to add wallet')
        reject();
      })
    })
  }

  const isValidAddress = (addr: string) => {
    return addr.startsWith('0x') && addr.length === 42
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add Wallet</h2>
          <button
            onClick={() => { if (!isLoading) onClose() }}
            className={`p-1 hover:bg-secondary rounded-lg transition-colors${isLoading ? ' opacity-40 pointer-events-none' : ''}`}
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Ethereum Address
            </label>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
                disabled={isLoading}
              />
            </div>
            {address && !isValidAddress(address) && (
              <p className="text-sm text-destructive mt-1">
                Please enter a valid Ethereum address
              </p>
            )}
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => { if (!isLoading) onClose() }}
              className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValidAddress(address) || isLoading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add Wallet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
