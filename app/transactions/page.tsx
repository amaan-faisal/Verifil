'use client'

import { useState, useEffect } from 'react'
import { ArrowLeftRight, Search, Download, PieChart, Wallet, User } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import Pagination from '@/components/Pagination'
import StatusIndicators from '@/components/StatusIndicators'
import { walletApi, Transaction } from '@/lib/api'
import WalletProvider, { useWallets } from '@/components/WalletProvider'
import { saveAs } from 'file-saver'

export default function TransactionsPage() {
  const { wallets } = useWallets();
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedWallet, setSelectedWallet] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [txPage, setTxPage] = useState(1)
  const [txPerPage, setTxPerPage] = useState(10)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  const navigationItems = [
    { icon: PieChart, label: 'Portfolio', href: '/portfolio', active: false },
    { icon: Wallet, label: 'Wallets', href: '/wallets', active: false },
    { icon: ArrowLeftRight, label: 'Transactions', href: '/transactions', active: true },
  ]

  // Whenever wallets changes, if there are wallets and nothing is selected, set selectedWallet
  useEffect(() => {
    if (wallets.length > 0 && !selectedWallet) {
      setSelectedWallet(wallets[0].address)
    }
    if (wallets.length > 0 && selectedWallet && !wallets.find(w=>w.address===selectedWallet)) {
      setSelectedWallet(wallets[0].address)
    }
  }, [wallets, selectedWallet])

  const fetchTransactions = async (address: string) => {
    if (!address) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await walletApi.getTransactions(address)
      setTransactions(data.transactions)
      setLastSyncTime(new Date())
    } catch (error: any) {
      setError('Could not load transactions. Try again later.')
      // Do not overwrite previous good data!
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedWallet) return
    fetchTransactions(selectedWallet)
  }, [selectedWallet])

  useEffect(() => {
    if (!selectedWallet) return
    const interval = setInterval(() => fetchTransactions(selectedWallet), 60000)
    return () => clearInterval(interval)
  }, [selectedWallet])

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'sent' && tx.from.toLowerCase() === selectedWallet.toLowerCase()) ||
      (filterType === 'received' && tx.to.toLowerCase() === selectedWallet.toLowerCase()) ||
      (filterType === 'eth' && tx.token_symbol === 'ETH') ||
      (filterType === 'tokens' && tx.token_symbol !== 'ETH')
    
    return matchesSearch && matchesFilter
  })

  const paginatedTransactions = filteredTransactions.slice(
    (txPage - 1) * txPerPage,
    txPage * txPerPage
  )

  const formatValue = (value: number, decimals: number = 4) => {
    return value.toFixed(decimals)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getTransactionType = (tx: Transaction) => {
    if (tx.from.toLowerCase() === selectedWallet.toLowerCase()) {
      return { type: 'sent', color: 'text-red-400' }
    } else if (tx.to.toLowerCase() === selectedWallet.toLowerCase()) {
      return { type: 'received', color: 'text-green-400' }
    }
    return { type: 'other', color: 'text-muted-foreground' }
  }

  // Export function
  const handleExport = () => {
    if (filteredTransactions.length === 0) return

    const header = ['Hash', 'Type', 'Value', 'Symbol', 'USD Value', 'From', 'To', 'Timestamp', 'Gas Price']
    const rows = filteredTransactions.map(tx => [
      tx.hash,
      getTransactionType(tx).type,
      formatValue(tx.value || tx.value_eth || 0),
      tx.token_symbol || 'ETH',
      tx.value_usd ? tx.value_usd.toFixed(2) : 'N/A',
      formatAddress(tx.from),
      formatAddress(tx.to),
      new Date(tx.timestamp * 1000).toLocaleString(),
      tx.gas_price === undefined ? '' : tx.gas_price.toFixed(2)
    ])
    const txtContent = [header, ...rows].map(row => row.join('\t')).join('\r\n')
    const blob = new Blob([txtContent], {type: 'text/plain;charset=utf-8;'})
    const filename = `transactions_${selectedWallet.slice(0,6)}...${selectedWallet.slice(-4)}.txt`
    
    // Use file-saver for cross-browser compatibility
    saveAs(blob, filename)
  };

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
          <StatusIndicators wallets={[{ total_portfolio_value_usd: 0, transaction_count: transactions.length }]} lastSyncTime={lastSyncTime || undefined} />

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
            <h1 className="text-3xl font-bold mb-2">Transactions</h1>
            <p className="text-muted-foreground">
              All activity for your selected wallet
            </p>
            {lastSyncTime && (
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {lastSyncTime.toLocaleTimeString()} • Auto-refreshing every 1m
              </p>
            )}
          </div>
          {/* Wallet selection and filter controls (standardized) */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Wallet</label>
            {wallets.length === 0 ? (
              <div className="bg-muted text-muted-foreground rounded-lg px-4 py-3 flex items-center">No wallets found. Add a wallet from the Wallets tab.</div>
            ) : (
              <select
                value={selectedWallet}
                onChange={(e) => {
                  setSelectedWallet(e.target.value)
                  fetchTransactions(e.target.value)
                }}
                className="w-full px-4 py-2 pr-8 bg-card border border-border rounded-lg appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
              >
                {wallets.map((wallet) => (
                  <option key={wallet.address} value={wallet.address}>
                    {wallet.address.slice(0,6)}...{wallet.address.slice(-4)} - ${wallet.total_portfolio_value_usd.toFixed(2)}
                  </option>
                ))}
              </select>
            )}
          </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by hash, from, or to address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 pr-8 bg-card border border-border rounded-lg appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="all">All Transactions</option>
              <option value="sent">Sent</option>
              <option value="received">Received</option>
              <option value="eth">ETH Only</option>
              <option value="tokens">Tokens Only</option>
            </select>
          </div>
          {/* Loading/Error state */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg">Loading transactions...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-red-500 text-lg">{error}</span>
            </div>
          ) : paginatedTransactions.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">No transactions found</div>
            </div>
          ) : (
            <>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Hash
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        From
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedTransactions.map((tx) => {
                      const txType = getTransactionType(tx)
                      return (
                        <tr key={tx.hash} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${txType.color}`}>
                              {txType.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a
                              href={`https://etherscan.io/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              {formatAddress(tx.hash)}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              {formatValue(tx.value || tx.value_eth || 0)} {tx.token_symbol || 'ETH'}
                            </div>
                            {tx.value_usd && (
                              <div className="text-xs text-muted-foreground">
                                ${tx.value_usd.toFixed(2)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {formatAddress(tx.from)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {formatAddress(tx.to)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(tx.timestamp * 1000).toLocaleString()}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredTransactions.length > txPerPage && (
                <Pagination
                  currentPage={txPage}
                  totalItems={filteredTransactions.length}
                  setPage={setTxPage}
                  itemsPerPage={txPerPage}
                  setItemsPerPage={setTxPerPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
