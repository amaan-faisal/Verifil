'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { statsApi } from '@/lib/api'
import { ArrowRight, Shield, Eye, TrendingUp, Wallet, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function LandingPage() {
  const [email, setEmail] = useState('')

  const features = [
    {
      icon: Shield,
      title: 'Risk Analysis',
      description: 'Detect honeypots, rug pulls, and risky tokens automatically'
    },
    {
      icon: Eye,
      title: 'Real-time Monitoring',
      description: 'Track wallet balances and transactions with live blockchain data'
    },
    {
      icon: TrendingUp,
      title: 'Portfolio Insights',
      description: 'Get comprehensive analytics on your crypto holdings'
    }
  ]

  const { data: stats, isLoading: statsLoading } = useSWR('stats', statsApi.getStats, { refreshInterval: 5000 })

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            {/* Only one top-right action if destination is the same */}
            <Link href="/portfolio" passHref>
              <button className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition">Get Started</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Secure Your Crypto
            <span className="text-primary block">Portfolio</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            VeriFil analyzes your Ethereum wallets to detect scams, honeypots, and risky tokens.
            Protect your investments with real-time risk assessment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/wallets"
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              Start Analyzing
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Replace with your real demo
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 border border-primary text-primary rounded-lg hover:bg-primary/10 transition font-medium ml-4"
            >
              Watch Demo
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Wallets Analyzed */}
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {statsLoading ? (
                  <span className="inline-block h-8 w-32 bg-muted rounded-xl animate-pulse" />
                ) : (
                  stats?.wallets_analyzed ?? 0
                )}
              </div>
              <div className="text-muted-foreground">Wallets Analyzed</div>
            </div>
            {/* Scams Detected */}
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {statsLoading ? (
                  <span className="inline-block h-8 w-32 bg-muted rounded-xl animate-pulse" />
                ) : (
                  stats?.scams_detected ?? 0
                )}
              </div>
              <div className="text-muted-foreground">Scams Detected</div>
            </div>
            {/* Users Protected */}
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {statsLoading ? (
                  <span className="inline-block h-8 w-32 bg-muted rounded-xl animate-pulse" />
                ) : (
                  stats?.users_protected ?? 0
                )}
              </div>
              <div className="text-muted-foreground">Users Protected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose VeriFil?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced blockchain analysis tools to keep your crypto investments safe
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in minutes with our simple 3-step process
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Wallet</h3>
              <p className="text-muted-foreground">
                Add your Ethereum wallet address to start monitoring
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your holdings for potential risks
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Stay Protected</h3>
              <p className="text-muted-foreground">
                Get instant alerts about suspicious tokens and activities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Secure Your Portfolio?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who trust VeriFil to protect their crypto investments
          </p>
          <Link
            href="/wallets"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="md" />
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/portfolio" className="hover:text-foreground transition-colors">
                Portfolio
              </Link>
              <Link href="/wallets" className="hover:text-foreground transition-colors">
                Wallets
              </Link>
              <Link href="/transactions" className="hover:text-foreground transition-colors">
                Transactions
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 VeriFil. All rights reserved. Built for crypto security.
          </div>
        </div>
      </footer>
    </div>
  )
}