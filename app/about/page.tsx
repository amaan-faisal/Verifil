'use client'

import Link from 'next/link'
import Image from 'next/image'
import Logo from "../../components/Logo"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between">
        <div className="mb-8">
            <Link href="/" className="flex items-center gap-2">
              <Logo size="md" />
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            <Link href="/">Home</Link>
            <span className="mx-2">/</span>
            <span>About</span>
          </div>
        </div>
      </div>

      {/* Intro */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-in fade-in slide-in-from-left-8 duration-1000">About Verifil</h1>
          <p className="text-lg md:text-xl text-muted-foreground animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
            We help you analyze wallets, monitor portfolios, and stay safe from scams.
          </p>
        </div>
      </section>

      {/* What & Why */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border border-border bg-card/40 animate-in fade-in slide-in-from-left-8 duration-1000 hover-fluid-float hover-flowing-shimmer transition-all duration-500 cursor-pointer animate-delay-100">
            <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
            <p className="text-muted-foreground">Bring clarity and security to Web3 by providing transparent analytics and automated risk detection for everyone.</p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card/40 animate-in fade-in slide-in-from-left-8 duration-1000 hover-fluid-float hover-flowing-shimmer transition-all duration-500 cursor-pointer animate-delay-100">
            <h2 className="text-xl font-semibold mb-2">What We Build</h2>
            <p className="text-muted-foreground">Wallet scanning, transaction history, portfolio insights, and risk analysis powered by trusted data providers.</p>
          </div>
        </div>

        {/* Core Principles */}
        <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border border-border bg-card/40 hover-fluid-float hover-flowing-shimmer transition-all duration-500 cursor-pointer animate-delay-300">
            <div className="font-semibold mb-1">Accuracy</div>
            <div className="text-sm text-muted-foreground">Aggregated data from Etherscan, CoinGecko and on-chain heuristics.</div>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card/40 animate-in fade-in slide-in-from-left-8 duration-1000 hover-fluid-float hover-flowing-shimmer transition-all duration-500 cursor-pointer animate-delay-100">
            <div className="font-semibold mb-1">Security</div>
            <div className="text-sm text-muted-foreground">Read-only analysis. We never request private keys or signatures.</div>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card/40 hover-fluid-float hover-flowing-shimmer transition-all duration-500 cursor-pointer animate-delay-500">
            <div className="font-semibold mb-1">Transparency</div>
            <div className="text-sm text-muted-foreground">Every finding links back to the on-chain evidence and transactions.</div>
          </div>
        </div>

        {/* Roadmap */}
        <div className="max-w-6xl mx-auto mt-10">
          <h3 className="text-lg font-semibold mb-4">Roadmap</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-lg border border-border bg-card/40 animate-in fade-in slide-in-from-left-8 duration-1000 hover-fluid-float hover-flowing-shimmer transition-all duration-500 cursor-pointer animate-delay-100">
              <div className="font-medium">Q1: Portfolio Alerts</div>
              <div className="text-sm text-muted-foreground">Threshold alerts, watchlists, mobile push</div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card/30 hover-fluid-float hover-flowing-shimmer transition-all duration-500 cursor-pointer animate-delay-200">
              <div className="font-medium">Q2: Multi-Chain</div>
              <div className="text-sm text-muted-foreground">Add support for major EVM chains and L2s</div>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card/40 animate-in fade-in slide-in-from-left-8 duration-1000 hover-fluid-float hover-flowing-shimmer transition-all duration-500 cursor-pointer animate-delay-100">
              <div className="font-medium">Q3: Community Signals</div>
              <div className="text-sm text-muted-foreground">Crowd-sourced risk reports and safe lists</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto text-center mt-12">
          <Link href="/portfolio" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover-elastic-bounce hover-breathing-glow transition-all duration-500 cursor-pointer">
            Explore the App
          </Link>
        </div>
      </section>
    </div>
  )
}


