import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

export interface WalletData {
  address: string
  eth_balance: number
  eth_price_usd: number
  eth_value_usd: number
  token_holdings: TokenHolding[]
  total_token_value_usd: number
  total_portfolio_value_usd: number
  holdings_count: number
}

export interface TokenHolding {
  name: string
  symbol: string
  balance: number
  contract: string
  price_usd: number
  value_usd: number
}

export interface Transaction {
  hash: string
  type: 'send' | 'receive'
  from: string
  to: string
  value_eth?: number
  value?: number
  value_usd?: number
  timestamp: number
  block_number: number
  gas_used: number
  gas_price: number
  is_error: boolean
  asset: string
  token_name?: string
  token_symbol?: string
  contract_address?: string
}

export interface RiskAnalysis {
  address: string
  risk_score: number
  risk_level: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  tokens_analyzed: number
  risky_tokens_count: number
  risky_tokens: RiskyToken[]
  recommendations: string[]
}

export interface RiskyToken {
  name: string
  symbol: string
  contract: string
  balance: number
  risk_flags: string[]
  risk_score: number
}

export interface StatsData {
  wallets_analyzed: number;
  users_protected: number;
  scams_detected: number;
}

export const walletApi = {
  // Get wallet information
  async getWallet(address: string): Promise<WalletData> {
    const response = await api.get(`/api/wallet/${address}`)
    return response.data
  },

  // Get wallet transactions
  async getTransactions(address: string, limit = 50, type = 'all'): Promise<{
    address: string
    transactions: Transaction[]
    total_count: number
    sent_count: number
    received_count: number
    limit: number
  }> {
    const response = await api.get(`/api/wallet/${address}/transactions`, {
      params: { limit, type }
    })
    return response.data
  },

  // Get risk analysis
  async getRiskAnalysis(address: string): Promise<RiskAnalysis> {
    const response = await api.get(`/api/wallet/${address}/risk-analysis`)
    return response.data
  },

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await api.get('/api/health')
    return response.data
  }
}

export const statsApi = {
  async getStats(): Promise<StatsData> {
    const response = await api.get('/api/stats');
    return response.data;
  },
};

export default api
