import { WalletData } from './api'

export const demoWallets: WalletData[] = [
  {
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    eth_balance: 0.00015,
    eth_price_usd: 123000,
    eth_value_usd: 18.47,
    token_holdings: [
      {
        name: 'USD Coin',
        symbol: 'USDC',
        balance: 100.0,
        contract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        price_usd: 1.0,
        value_usd: 100.0
      },
      {
        name: 'Chainlink',
        symbol: 'LINK',
        balance: 5.2,
        contract: '0x514910771af9ca656af840dff83e8264ecf986ca',
        price_usd: 15.50,
        value_usd: 80.60
      }
    ],
    total_token_value_usd: 180.60,
    total_portfolio_value_usd: 199.07,
    holdings_count: 3
  },
  {
    address: '0x8ba1f109551bD432803012645Hac136c',
    eth_balance: 0.00008,
    eth_price_usd: 123000,
    eth_value_usd: 9.73,
    token_holdings: [
      {
        name: 'Uniswap',
        symbol: 'UNI',
        balance: 10.0,
        contract: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
        price_usd: 6.20,
        value_usd: 62.0
      }
    ],
    total_token_value_usd: 62.0,
    total_portfolio_value_usd: 71.73,
    holdings_count: 2
  },
  {
    address: '0x4aa0dd4aa0dd4aa0dd4aa0dd4aa0dd4aa0dd4aa0',
    eth_balance: 0.000004,
    eth_price_usd: 123000,
    eth_value_usd: 0.54,
    token_holdings: [
      {
        name: 'Aave',
        symbol: 'AAVE',
        balance: 0.5,
        contract: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
        price_usd: 120.0,
        value_usd: 60.0
      },
      {
        name: 'Compound',
        symbol: 'COMP',
        balance: 2.0,
        contract: '0xc00e94cb662c3520282e6f5717214004a7f26888',
        price_usd: 45.0,
        value_usd: 90.0
      },
      {
        name: 'Maker',
        symbol: 'MKR',
        balance: 0.1,
        contract: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
        price_usd: 2000.0,
        value_usd: 200.0
      },
      {
        name: 'Basic Attention Token',
        symbol: 'BAT',
        balance: 100.0,
        contract: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
        price_usd: 0.25,
        value_usd: 25.0
      },
      {
        name: 'Polygon',
        symbol: 'MATIC',
        balance: 50.0,
        contract: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
        price_usd: 0.80,
        value_usd: 40.0
      },
      {
        name: 'Wrapped Bitcoin',
        symbol: 'WBTC',
        balance: 0.01,
        contract: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        price_usd: 45000.0,
        value_usd: 450.0
      }
    ],
    total_token_value_usd: 865.0,
    total_portfolio_value_usd: 865.54,
    holdings_count: 7
  }
]

export const demoTransactions = [
  {
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    type: 'receive' as const,
    from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    to: '0x8ba1f109551bD432803012645Hac136c',
    value_eth: 0.1,
    timestamp: Date.now() / 1000 - 3600, // 1 hour ago
    block_number: 18500000,
    gas_used: 21000,
    gas_price: 20,
    is_error: false,
    asset: 'ETH'
  },
  {
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    type: 'send' as const,
    from: '0x8ba1f109551bD432803012645Hac136c',
    to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    value: 100.0,
    timestamp: Date.now() / 1000 - 7200, // 2 hours ago
    block_number: 18499950,
    gas_used: 65000,
    gas_price: 25,
    is_error: false,
    asset: 'USDC',
    token_name: 'USD Coin',
    token_symbol: 'USDC',
    contract_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
  }
]

export const demoRiskAnalysis = {
  address: '0x4aa0dd4aa0dd4aa0dd4aa0dd4aa0dd4aa0dd4aa0',
  risk_score: 25,
  risk_level: 'LOW' as const,
  tokens_analyzed: 6,
  risky_tokens_count: 1,
  risky_tokens: [
    {
      name: 'Suspicious Token',
      symbol: 'SUSP',
      contract: '0x1234567890abcdef1234567890abcdef12345678',
      balance: 1000.0,
      risk_flags: [
        'Very new token (only 2 days old)',
        'No market price data available'
      ],
      risk_score: 45
    }
  ],
  recommendations: [
    '⚠️ Review the SUSP token - it appears to be very new and has no market price',
    '✅ Most of your holdings look safe'
  ]
}
