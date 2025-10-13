'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, ArrowUpDown, Shield, History } from 'lucide-react'
import TokenIcon from './TokenIcon'
import RiskAnalysis from './RiskAnalysis'
import TransactionHistory from './TransactionHistory'
import { walletApi } from '@/lib/api'
import Pagination from './Pagination'

interface WalletDetailsProps {
  wallet: {
    address: string
    eth_balance: number
    eth_price_usd: number
    eth_value_usd: number
    token_holdings: any[]
    total_portfolio_value_usd: number
    holdings_count: number
  }
}

export default function WalletDetails({ wallet }: WalletDetailsProps) {
  const [activeTab, setActiveTab] = useState<'holdings' | 'transactions' | 'risk'>('holdings')
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<string>('')
  const [holdingsPage, setHoldingsPage] = useState(1);
  const holdingsPerPage = 10;
  useEffect(() => { setHoldingsPage(1); }, [wallet]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatValue = (value: number) => {
    if (value === 0) return '$0.00'
    if (value < 0.01) return '<$0.01'
    return `$${value.toFixed(2)}`
  }

  const handleSyncWallet = async () => {
    if (isSyncing) return
    
    setIsSyncing(true)
    setSyncStatus('Syncing wallet...')
    
    try {
      const updatedWallet = await walletApi.getWallet(wallet.address)
      // Note: This would need to be passed up to parent component to update the wallet
      setSyncStatus('Wallet synced successfully!')
      setTimeout(() => setSyncStatus(''), 3000)
    } catch (error) {
      console.error('Error syncing wallet:', error)
      setSyncStatus('Sync failed. Please try again.')
      setTimeout(() => setSyncStatus(''), 5000)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Ethereum Wallet {formatAddress(wallet.address)}
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={handleSyncWallet}
              disabled={isSyncing}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                isSyncing 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync wallet'}
            </button>
            <span className="text-sm text-muted-foreground">
              Last synced 4 hours ago
            </span>
          </div>
        </div>
      </div>

      {/* Sync Status */}
      {syncStatus && (
        <div className={`p-3 rounded-lg text-sm ${
          syncStatus.includes('successfully') 
            ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
            : syncStatus.includes('failed')
            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        }`}>
          {syncStatus}
        </div>
      )}

      {/* Total Value */}
      <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
        {formatValue(wallet.total_portfolio_value_usd)}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/30 p-1 rounded-xl border border-border/50">
        <button
          onClick={() => setActiveTab('holdings')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'holdings'
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-foreground shadow-sm border border-blue-500/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <ArrowUpDown className="w-4 h-4" />
          Holdings
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'transactions'
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-foreground shadow-sm border border-blue-500/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <History className="w-4 h-4" />
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('risk')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'risk'
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-foreground shadow-sm border border-blue-500/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Shield className="w-4 h-4" />
          Risk Analysis
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'holdings' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Holdings</h3>
          </div>
        
          <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 gap-4 p-5 border-b border-border/50 bg-gradient-to-r from-muted/30 to-muted/10">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <span className="text-muted-foreground">Name</span>
                <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2 font-semibold text-sm">
                <span className="text-muted-foreground">Holdings</span>
                <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2 font-semibold text-sm">
                <span className="text-muted-foreground">Transactions</span>
                <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
          
            <div className="divide-y divide-border/30">
              {/* ETH Row */}
              <div className="grid grid-cols-3 gap-4 p-5 hover:bg-muted/20 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <TokenIcon symbol="ETH" size={32} />
                  <span className="font-semibold">ETH</span>
                </div>
                <div>
                  <div className="font-semibold text-lg">{formatValue(wallet.eth_value_usd)}</div>
                  <div className="text-sm text-muted-foreground">
                    {wallet.eth_balance.toFixed(6)} ETH
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <span className="px-2 py-1 bg-muted/50 rounded-md">1</span>
                </div>
              </div>

              {/* Token Holdings */}
              {wallet.token_holdings.slice((holdingsPage-1)*holdingsPerPage, holdingsPage*holdingsPerPage).map((holding, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 p-5 hover:bg-muted/20 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <TokenIcon symbol={holding.symbol} address={(holding as any).contract_address} size={32} />
                    <span className="font-semibold">{holding.symbol}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{formatValue(holding.value_usd || 0)}</div>
                    <div className="text-sm text-muted-foreground">
                      {holding.balance.toFixed(6)} {holding.symbol}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <span className="px-2 py-1 bg-muted/50 rounded-md">-</span>
                  </div>
                </div>
              ))}
          </div>
          {/* Pagination for holdings */}
          <Pagination
            currentPage={holdingsPage}
            totalItems={wallet.token_holdings.length}
            setPage={setHoldingsPage}
            itemsPerPage={holdingsPerPage}
          />
        </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <TransactionHistory key={wallet.address} address={wallet.address} />
      )}

      {activeTab === 'risk' && (
        <RiskAnalysis key={`risk-${wallet.address}`} address={wallet.address} />
      )}
    </div>
  )
}
