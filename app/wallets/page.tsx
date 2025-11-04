'use client'

import { useState, useEffect } from 'react'
import { Wallet, Plus, RefreshCw, Search, PieChart, ArrowLeftRight, User } from 'lucide-react'
import Link from 'next/link'
import WalletCard from '@/components/WalletCard'
import WalletDetails from '@/components/WalletDetails'
import AddWalletModal from '@/components/AddWalletModal'
import StatusIndicators from '@/components/StatusIndicators'
import { walletApi, WalletData } from '@/lib/api'
import { demoWallets } from '@/lib/demo-data'
import Logo from '@/components/Logo'
import DeleteInstructions from '@/components/DeleteInstructions'
import WalletProvider, { useWallets } from '@/components/WalletProvider'
import Pagination from '@/components/Pagination'

export default function WalletsPage() {
  // const [wallets, setWallets] = useState<WalletData[]>([])
  const { wallets, setWallets, addWallet, removeWallet } = useWallets();
  const [selectedWallet, setSelectedWallet] = useState<WalletData | null>(null)
  const [showAddWallet, setShowAddWallet] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('highest_value')
  const [showZeroWallets, setShowZeroWallets] = useState(false)
  const [walletPage, setWalletPage] = useState(1)
  const [walletsPerPage, setWalletsPerPage] = useState(5)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState('');

  const navigationItems = [
    { icon: PieChart, label: 'Portfolio', href: '/portfolio', active: false },
    { icon: Wallet, label: 'Wallets', href: '/wallets', active: true },
    { icon: ArrowLeftRight, label: 'Transactions', href: '/transactions', active: false },
  ]

  const filteredWallets = wallets.filter(wallet => {
    const matchesSearch = wallet.address.toLowerCase().includes(searchTerm.toLowerCase())
    const hasValue = showZeroWallets || wallet.total_portfolio_value_usd > 0
    return matchesSearch && hasValue
  })

  const sortedWallets = [...filteredWallets].sort((a, b) => {
    switch (sortBy) {
      case 'highest_value':
        return b.total_portfolio_value_usd - a.total_portfolio_value_usd
      case 'lowest_value':
        return a.total_portfolio_value_usd - b.total_portfolio_value_usd
      case 'newest':
        return 0 // TODO: Add timestamp sorting
      case 'oldest':
        return 0 // TODO: Add timestamp sorting
      default:
        return 0
    }
  })

  const paginatedWallets = sortedWallets.slice(
    (walletPage - 1) * walletsPerPage,
    walletPage * walletsPerPage
  )

  // Update handleAddWallet to use addWallet context fn
  const handleAddWallet = async (address: string, resolve: () => void, reject: (err: Error) => void) => {
    try {
      const walletData = await walletApi.getWallet(address)
      addWallet(walletData)
      setSelectedWallet(walletData)
      resolve();
    } catch (err: any) {
      reject(err instanceof Error ? err : new Error('Failed to add wallet'))
    }
  }
  // Update handleDeleteWallet
  const handleDeleteWallet = (address: string) => {
    removeWallet(address)
    // If the deleted wallet was selected, select the first remaining wallet or null
    const remainingWallets = wallets.filter(wallet => wallet.address !== address)
    setSelectedWallet(remainingWallets.length > 0 ? remainingWallets[0] : null)
  }

  const [lastSyncTime, setLastSyncTime] = useState<Date | undefined>(undefined)

  useEffect(() => {
    // Load real data from the beginning
    const loadInitialData = async () => {
      setIsLoading(true)
      try {
        // Load demo wallets as real data
        const loadedWallets = await Promise.all(
          demoWallets.map(async (demoWallet) => {
            try {
              const realWallet = await walletApi.getWallet(demoWallet.address)
              return realWallet
            } catch (error) {
              console.error(`Error loading wallet ${demoWallet.address}:`, error)
              // Fallback to demo data if API fails
              return demoWallet
            }
          })
        )
        
        setWallets(loadedWallets)
        setLastSyncTime(new Date())
        if (loadedWallets.length > 0) {
          setSelectedWallet(loadedWallets[0])
        }
      } catch (error) {
        console.error('Error loading initial data:', error)
        // Fallback to demo data
        setWallets(demoWallets)
        setSelectedWallet(demoWallets[0])
      } finally {
        setIsLoading(false)
      }
    }
    
    loadInitialData()
  }, [])

  // Auto-refresh wallets every 1 minute
  useEffect(() => {
    if (wallets.length === 0 || isLoading || isSyncing) return
    
    const interval = setInterval(async () => {
      try {
        const updatedWallets = await Promise.all(
          wallets.map(async (wallet) => {
            try {
              const walletData = await walletApi.getWallet(wallet.address)
              return walletData
            } catch (error) {
              console.error(`Error auto-refreshing wallet ${wallet.address}:`, error)
              return wallet
            }
          })
        )
        setWallets(updatedWallets)
        
        // Update selected wallet if it was refreshed
        if (selectedWallet) {
          const updatedSelected = updatedWallets.find(w => w.address === selectedWallet.address)
          if (updatedSelected) {
            setSelectedWallet(updatedSelected)
          }
        }
        
        setLastSyncTime(new Date())
      } catch (error) {
        console.error('Error during auto-refresh:', error)
      }
    }, 60000) // Refresh every 1 minute
    
    return () => clearInterval(interval)
  }, [wallets, selectedWallet, isLoading, isSyncing])

  const handleSyncAll = async () => {
    if (isSyncing) return
    
    setIsSyncing(true)
    setSyncStatus('Starting sync...')
    
    try {
      const syncPromises = wallets.map(async (wallet, index) => {
        setSyncStatus(`Syncing wallet ${index + 1}/${wallets.length}...`)
        try {
          const updatedWallet = await walletApi.getWallet(wallet.address)
          return updatedWallet
        } catch (error) {
          console.error(`Error syncing wallet ${wallet.address}:`, error)
          return wallet // Return original wallet if sync fails
        }
      })
      
      const syncedWallets = await Promise.all(syncPromises)
      setWallets(syncedWallets)
      
      // Update selected wallet if it was synced
      if (selectedWallet) {
        const updatedSelected = syncedWallets.find(w => w.address === selectedWallet.address)
        if (updatedSelected) {
          setSelectedWallet(updatedSelected)
        }
      }
      
      setSyncStatus('Sync completed successfully!')
      setLastSyncTime(new Date())
      setTimeout(() => setSyncStatus(''), 3000) // Clear status after 3 seconds
      
    } catch (error) {
      console.error('Error during sync:', error)
      setSyncStatus('Sync failed. Please try again.')
      setTimeout(() => setSyncStatus(''), 5000)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border min-h-screen p-6">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2">
              <Logo size="md" />
            </Link>
          </div>

          {/* Status Indicators */}
          <StatusIndicators wallets={wallets} lastSyncTime={lastSyncTime} />

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item, index) => (
              item.href ? (
                <Link
                  key={index}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    item.active
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ) : (
                <div
                  key={index}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    item.active
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              )
            ))}
          </nav>

          {/* Account Section */}
          <div className="mt-auto pt-8">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">Account</div>
                <div className="text-xs text-muted-foreground">Free</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Wallets</h1>
              <div className="flex gap-3">
                <button
                  onClick={handleSyncAll}
                  disabled={isSyncing || isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isSyncing || isLoading
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync all'}
                </button>
                <button
                  onClick={() => setShowAddWallet(true)}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isLoading
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add wallet
                </button>
              </div>
            </div>

            {/* Sync Status */}
            {syncStatus && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                syncStatus.includes('completed') 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : syncStatus.includes('failed')
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {syncStatus}
              </div>
            )}

            {/* Search and Sort */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Type to find a wallet or chain..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 pr-8 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                style={{display: 'none', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="highest_value">Highest market value</option>
                <option value="lowest_value">Lowest market value</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-lg">Loading wallets...</span>
                </div>
                <div className="text-sm px-3 py-2 rounded-md border bg-yellow-500/10 border-yellow-500/20 text-yellow-400 animate-pulse">
                  ⚠️ This may take 30+ seconds
                </div>
              </div>
            )}
          </div>

          {/* Content Area */}
          {!isLoading && (
            <div className="flex gap-6">
              {/* Wallet List */}
              <div className="w-1/3">
                <div className="mb-4">
                <h2 className="text-lg font-semibold mb-3">Wallets</h2>
                <DeleteInstructions />
                <div className="space-y-3">
                  {paginatedWallets.map((wallet, index) => (
                    <WalletCard
                      key={index}
                      wallet={wallet}
                      isSelected={selectedWallet?.address === wallet.address}
                      onClick={() => setSelectedWallet(wallet)}
                      onDelete={handleDeleteWallet}
                      isEmpty={wallet.total_portfolio_value_usd === 0 || wallet.holdings_count === 0}
                    />
                  ))}
                  {paginatedWallets.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No wallets found
                    </div>
                  )}
                </div>
                
                {/* Wallet List Pagination */}
                {sortedWallets.length > walletsPerPage && (
                  <Pagination
                    currentPage={walletPage}
                    totalItems={sortedWallets.length}
                    setPage={setWalletPage}
                    itemsPerPage={walletsPerPage}
                    setItemsPerPage={setWalletsPerPage}
                  />
                )}
                </div>

                {/* Other Transactions */}
                <div className="mb-4">
                  <div className="p-4 bg-card border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                        <ArrowLeftRight className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Other transactions</div>
                        <div className="text-sm text-muted-foreground">$0.00 • 0 assets</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-3">
                  <label className="text-sm text-muted-foreground">
                    Show wallets with 0 transactions
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowZeroWallets(!showZeroWallets)}
                    className={`w-12 h-6 rounded-full border transition-colors duration-200 flex items-center ${
                      showZeroWallets ? 'bg-green-500 border-green-500' : 'bg-muted border-border'
                    }`}
                    aria-pressed={showZeroWallets}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 border-2 ${
                        showZeroWallets ? 'translate-x-6 border-green-400 ring-2 ring-2 ring-green-300' : 'translate-x-0.5 border-muted'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Wallet Details */}
              <div className="flex-1">
                {selectedWallet ? (
                  <WalletDetails wallet={selectedWallet} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a wallet to view details</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Wallet Modal */}
      {showAddWallet && (
        <AddWalletModal
          onClose={() => setShowAddWallet(false)}
          onAdd={handleAddWallet}
        />
      )}


    </div>
  )
}
