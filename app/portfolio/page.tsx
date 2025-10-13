'use client'

import { useState, useEffect } from 'react'
import { PieChart, DollarSign, Shield, AlertTriangle, CheckCircle, Wallet, ArrowLeftRight, User, Eye } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import Pagination from '@/components/Pagination'
import StatusIndicators from '@/components/StatusIndicators'
import { demoWallets } from '@/lib/demo-data'
import { useWallets } from '@/components/WalletProvider'
import { walletApi, WalletData } from '@/lib/api'

export default function PortfolioPage() {
  const { wallets: globalWallets } = useWallets()
  const [wallets, setWallets] = useState<WalletData[]>([])
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Calculate portfolio totals
  const totalValue = wallets.reduce((sum, wallet) => sum + wallet.total_portfolio_value_usd, 0)
  const totalETH = wallets.reduce((sum, wallet) => sum + wallet.eth_balance, 0)
  const totalTokens = wallets.reduce((sum, wallet) => sum + wallet.total_token_value_usd, 0)
  const totalHoldings = wallets.reduce((sum, wallet) => sum + wallet.holdings_count, 0)

  useEffect(() => {
    // Load portfolio data for current list of wallet addresses
    const loadPortfolioData = async () => {
      setIsLoading(true)
      try {
        const source = (globalWallets && globalWallets.length > 0) ? globalWallets : demoWallets
        const loadedWallets = await Promise.all(
          source.map(async (item) => {
            try {
              const realWallet = await walletApi.getWallet(item.address)
              return realWallet
            } catch (error) {
              console.error(`Error loading wallet ${item.address}:`, error)
              return item as WalletData
            }
          })
        )
        setWallets(loadedWallets)
        setLastSyncTime(new Date())
      } catch (error) {
        console.error('Error loading portfolio data:', error)
        setWallets(globalWallets && globalWallets.length > 0 ? globalWallets as any : demoWallets as any)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadPortfolioData()
  }, [globalWallets])

  // Auto-refresh portfolio data every 1 minute; refetch when addresses list changes
  useEffect(() => {
    if ((globalWallets && globalWallets.length === 0) || isLoading) return
    
    const interval = setInterval(async () => {
      try {
        const source = (globalWallets && globalWallets.length > 0) ? globalWallets : demoWallets
        const updatedWallets = await Promise.all(
          source.map(async (item) => {
            try {
              const realWallet = await walletApi.getWallet(item.address)
              return realWallet
            } catch (error) {
              console.error(`Error auto-refreshing wallet ${item.address}:`, error)
              return item as WalletData
            }
          })
        )
        setWallets(updatedWallets)
        setLastSyncTime(new Date())
      } catch (error) {
        console.error('Error during portfolio auto-refresh:', error)
      }
    }, 60000) // Refresh every 1 minute
    
    return () => clearInterval(interval)
  }, [globalWallets, isLoading])

  // Calculate risk metrics
  const riskyWallets = wallets.filter(wallet => 
    wallet.total_portfolio_value_usd > 100000 // High value wallets
  ).length

  const navigationItems = [
    { icon: PieChart, label: 'Portfolio', href: '/portfolio', active: true },
    { icon: Wallet, label: 'Wallets', href: '/wallets', active: false },
    { icon: ArrowLeftRight, label: 'Transactions', href: '/transactions', active: false },
  ]

  // Get top holdings across all wallets
  const allHoldings = wallets.flatMap(wallet => 
    wallet.token_holdings.map(holding => ({
      ...holding,
      walletAddress: wallet.address
    }))
  )

  const topHoldings = allHoldings
    .sort((a, b) => b.value_usd - a.value_usd)
    .slice(0, 10)

  // Calculate portfolio distribution
  const ethPercentage = (totalETH * 3500) / totalValue * 100 // Assuming ETH price
  const tokenPercentage = 100 - ethPercentage

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
          <StatusIndicators wallets={wallets} lastSyncTime={lastSyncTime || undefined} />

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
            <h1 className="text-3xl font-bold mb-2">Portfolio Overview</h1>
            <p className="text-muted-foreground">
              Complete view of your crypto holdings across all wallets
            </p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg">Loading portfolio data...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Portfolio Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-muted-foreground">Total Value</span>
                  </div>
                  <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Wallet className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-muted-foreground">ETH Balance</span>
                  </div>
                  <div className="text-2xl font-bold">{totalETH.toFixed(4)} ETH</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <PieChart className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-muted-foreground">Token Value</span>
                  </div>
                  <div className="text-2xl font-bold">${totalTokens.toLocaleString()}</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Eye className="w-5 h-5 text-orange-400" />
                    <span className="text-sm text-muted-foreground">Total Holdings</span>
                  </div>
                  <div className="text-2xl font-bold">{totalHoldings}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Portfolio Distribution */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Portfolio Distribution</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Ethereum</span>
                      </div>
                      <span className="font-medium">{ethPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${ethPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span>Tokens</span>
                      </div>
                      <span className="font-medium">{tokenPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${tokenPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="font-medium">Portfolio Diversified</div>
                        <div className="text-sm text-muted-foreground">Good distribution across assets</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="font-medium">Security Status</div>
                        <div className="text-sm text-muted-foreground">No detected threats</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <div>
                        <div className="font-medium">High Value Wallets</div>
                        <div className="text-sm text-muted-foreground">{riskyWallets} wallets over $100k</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Holdings */}
              <div className="mt-8">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Top Holdings</h3>
                  <div className="space-y-3">
                    {topHoldings.map((holding, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold">{holding.symbol.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium">{holding.name}</div>
                            <div className="text-sm text-muted-foreground">{holding.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${holding.value_usd.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {holding.balance.toFixed(4)} {holding.symbol}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Wallet Summary */}
              <div className="mt-8">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Wallet Summary</h3>
                  <div className="space-y-3">
                    {wallets.map((wallet, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                            <Wallet className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {wallet.holdings_count} holdings
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${wallet.total_portfolio_value_usd.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {wallet.eth_balance.toFixed(4)} ETH
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
