'use client'

import React from 'react'

interface TokenIconProps {
  symbol: string
  size?: number
  address?: string
}

export default function TokenIcon({ symbol, size = 24, address }: TokenIconProps) {
  const isEth = symbol.toUpperCase() === 'ETH'
  const dimension = `${size}px`

  if (isEth) {
    return (
      <div
        style={{ width: dimension, height: dimension }}
        className="rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm"
        aria-label="Ethereum"
        title="Ethereum"
      >
        <span className="text-white text-[10px] font-bold">ETH</span>
      </div>
    )
  }

  // Try official logos from TrustWallet assets repo when contract address is available
  const src = address
    ? `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
    : ''

  return (
    <img
      width={size}
      height={size}
      src={src}
      alt={symbol}
      title={symbol}
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement
        // graceful fallback to letter badge
        target.onerror = null
        target.replaceWith(Object.assign(document.createElement('div'), {
          className: 'rounded-full bg-muted flex items-center justify-center shadow-sm text-xs font-bold',
          style: `width:${dimension};height:${dimension};display:flex;align-items:center;justify-content:center;`,
          textContent: symbol.slice(0,1).toUpperCase(),
          title: symbol
        }) as unknown as Node)
      }}
      style={{ borderRadius: '9999px', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
    />
  )
}
