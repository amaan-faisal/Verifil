'use client'

import Link from 'next/link'
import Image from 'next/image'
import Logo from "../../components/Logo"

export default function SafetyPage() {
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
            <span>Safety</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-in fade-in slide-in-from-left-8 duration-1000">Stay Safe in Web3</h1>
          <p className="text-lg md:text-xl text-muted-foreground animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
            Practical guidance and tools to protect your wallets, tokens, and transactions.
          </p>
        </div>
      </section>

      {/* Core Guidance */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border border-border bg-card/40 animate-in fade-in slide-in-from-left-8 duration-1000 hover-float hover-shimmer transition-all duration-300 cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Best Practices</h2>
            <p className="text-muted-foreground">Use hardware wallets, verify contract addresses, and avoid approvals to unknown dApps.</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Enable multi-factor authentication on custodial services</li>
              <li>• Keep OS and browser extensions up to date</li>
              <li>• Use a fresh burner wallet for testing new dApps</li>
            </ul>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card/40 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 hover-float hover-shimmer transition-all duration-300 cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Risk Monitoring</h2>
            <p className="text-muted-foreground">Enable real-time analysis to flag honeypots, rug pulls, and malicious token behaviors.</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-md bg-muted/20 hover-float hover-shimmer transition-all duration-300 cursor-pointer">
                <div className="font-medium">Token Checks</div>
                <div className="text-muted-foreground">Liquidity • Ownership • Taxes</div>
              </div>
              <div className="p-3 rounded-md bg-muted/20 hover-float hover-shimmer transition-all duration-300 cursor-pointer">
                <div className="font-medium">Behavior</div>
                <div className="text-muted-foreground">Freezes • Blacklists • Mints</div>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card/40 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 hover-float hover-shimmer transition-all duration-300 cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Privacy & Security</h2>
            <p className="text-muted-foreground">Rotate wallets, limit on-chain exposure, and store seed phrases offline and securely.</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-md bg-muted/20 hover-float hover-shimmer transition-all duration-300 cursor-pointer">
                <div className="font-medium">Do</div>
                <ul className="text-muted-foreground space-y-1">
                  <li>Use unique addresses per counterparty</li>
                  <li>Prefer hardware signing</li>
                </ul>
              </div>
              <div className="p-3 rounded-md bg-muted/20 hover-float hover-shimmer transition-all duration-300 cursor-pointer">
                <div className="font-medium">Don't</div>
                <ul className="text-muted-foreground space-y-1">
                  <li>Reuse seed phrases</li>
                  <li>Share screenshots of keys</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Threat Matrix */}
        <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg border border-border bg-card/40 animate-in fade-in slide-in-from-left-8 duration-1000 hover-fluid-float hover-flowing-shimmer transition-all duration-500 cursor-pointer animate-delay-100">
            <h3 className="text-lg font-semibold">Threat Matrix</h3>
            <p className="text-sm text-muted-foreground mt-1">Common risks and how Verifil helps you mitigate them.</p>
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border bg-card/30 hover-float hover-shimmer transition-all duration-300 cursor-pointer">
              <div className="font-medium">Honeypot</div>
              <div className="text-sm text-muted-foreground mt-1">Token cannot be sold</div>
              <div className="mt-3 text-xs text-green-400">Detection: Ownership, sell tax, blacklist checks</div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card/30 hover-float hover-shimmer transition-all duration-300 cursor-pointer">
              <div className="font-medium">Rug Pull</div>
              <div className="text-sm text-muted-foreground mt-1">Liquidity removal / mint abuse</div>
              <div className="mt-3 text-xs text-green-400">Detection: Liquidity locks & mint limits</div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card/30 hover-float hover-shimmer transition-all duration-300 cursor-pointer">
              <div className="font-medium">Phishing</div>
              <div className="text-sm text-muted-foreground mt-1">Malicious sites/signing requests</div>
              <div className="mt-3 text-xs text-green-400">Detection: Domain allowlists & signature parsing</div>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="max-w-7xl mx-auto mt-12">
          <h3 className="text-lg font-semibold mb-4">Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/portfolio" className="p-4 rounded-lg border border-border bg-card/30 hover:bg-secondary/40 hover-float hover-shimmer transition-all duration-300 cursor-pointer">
              <div className="font-medium">Portfolio Risk Overview</div>
              <div className="text-sm text-muted-foreground">See risks across your holdings</div>
            </Link>
            <Link href="/transactions" className="p-4 rounded-lg border border-border bg-card/30 hover:bg-secondary/40 hover-float hover-shimmer transition-all duration-300 cursor-pointer">
              <div className="font-medium">Transaction Monitoring</div>
              <div className="text-sm text-muted-foreground">Track suspicious inflows/outflows</div>
            </Link>
            <Link href="/wallets" className="p-4 rounded-lg border border-border bg-card/30 hover:bg-secondary/40 hover-float hover-shimmer transition-all duration-300 cursor-pointer">
              <div className="font-medium">Wallet Scanner</div>
              <div className="text-sm text-muted-foreground">Analyze any wallet instantly</div>
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto mt-12">
          <h3 className="text-lg font-semibold mb-4 text-center">Safety FAQ</h3>
          <div className="space-y-3">
            <details className="rounded-lg border border-border bg-card/30 p-4 hover-float hover-shimmer transition-all duration-300 cursor-pointer">
              <summary className="cursor-pointer font-medium">How do I know a token is safe?</summary>
              <p className="mt-2 text-sm text-muted-foreground">No tool guarantees safety. Verifil highlights red flags (e.g., high taxes, owner privileges, unlocked liquidity) so you can make informed decisions.</p>
            </details>
            <details className="rounded-lg border border-border bg-card/30 p-4 hover-float hover-shimmer transition-all duration-300 cursor-pointer">
              <summary className="cursor-pointer font-medium">Should I trust contract renounce claims?</summary>
              <p className="mt-2 text-sm text-muted-foreground">Always verify renounce transaction and remaining privileged roles. Some proxies allow hidden upgrades.</p>
            </details>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center mt-12">
          <Link href="/wallets" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover-pulse-glow hover-center transition-all duration-300 cursor-pointer">
            Start Monitoring
          </Link>
        </div>
      </section>
    </div>
  )
}


