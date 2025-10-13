'use client'

import { useState, useEffect } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, Clock } from 'lucide-react'
import { walletApi, Transaction } from '@/lib/api'
import { formatTimeAgo, formatValue } from '@/lib/utils'
import Pagination from './Pagination'

interface TransactionHistoryProps {
  address: string
}

export default function TransactionHistory({ address }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'eth' | 'tokens'>('all')
  const [txPage, setTxPage] = useState(1);
  const txPerPage = 10;
  useEffect(() => { setTxPage(1); }, [address, filter]);

  useEffect(() => {
    if (address) {
      fetchTransactions()
    }
  }, [address, filter])

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const data = await walletApi.getTransactions(address, 50, filter)
      setTransactions(data.transactions)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTransactionIcon = (tx: Transaction) => {
    if (tx.type === 'receive') {
      return <ArrowDown className="w-4 h-4 text-green-400" />
    }
    return <ArrowUp className="w-4 h-4 text-red-400" />
  }

  const getTransactionColor = (tx: Transaction) => {
    if (tx.type === 'receive') {
      return 'text-green-400'
    }
    return 'text-red-400'
  }

  const formatTransactionValue = (tx: Transaction) => {
    if (tx.asset === 'ETH') {
      return `${tx.value_eth?.toFixed(6) || '0'} ETH`
    }
    return `${tx.value?.toFixed(6) || '0'} ${tx.token_symbol || 'TOKEN'}`
  }

  const getEtherscanUrl = (hash: string) => {
    return `https://etherscan.io/tx/${hash}`
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'eth' | 'tokens')}
            className="px-3 py-1 pr-8 bg-card border border-border rounded-lg text-sm"
          >
            <option value="all">All</option>
            <option value="eth">ETH</option>
            <option value="tokens">Tokens</option>
          </select>
          <button
            onClick={fetchTransactions}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No transactions found</p>
          </div>
        ) : (
          transactions.slice((txPage-1)*txPerPage, txPage*txPerPage).map((tx, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTransactionIcon(tx)}
                  <div>
                    <div className="font-medium">
                      {tx.type === 'receive' ? 'Received' : 'Sent'} {tx.asset}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatTimeAgo(tx.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${getTransactionColor(tx)}`}>
                    {tx.type === 'receive' ? '+' : '-'}{formatTransactionValue(tx)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Gas: {tx.gas_price ? tx.gas_price.toFixed(2) : 'N/A'} Gwei
                  </div>
                </div>
              </div>
              
              {tx.is_error && (
                <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                  Transaction failed
                </div>
              )}
              
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Block: {tx.block_number ? tx.block_number.toLocaleString() : 'N/A'}</span>
                <a
                  href={getEtherscanUrl(tx.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  View on Etherscan
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
      <Pagination
        currentPage={txPage}
        totalItems={transactions.length}
        setPage={setTxPage}
        itemsPerPage={txPerPage}
      />
    </div>
  )
}
