'use client'

import { ArrowRight, Shield, Eye, TrendingUp, Wallet } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Constants for statistics
const STATS = {
  scamsDetected: '1.3K+',
  users: '1K+',
  walletsScanned: '10K+'
}

export default function LandingPage() {

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


  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section - Full Screen with Video Background */}
      <section className="h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{
            filter: 'brightness(0.7) contrast(1.1) saturate(1.2)',
            objectPosition: 'center center'
          }}
        >
          <source src="/backgroundvid.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        {/* Floating Navigation Elements */}
        <div className="absolute top-0 left-0 right-0 z-30 p-6">
          <div className="flex justify-between items-center">
            {/* Logo - Top Left with more margin */}
            <div className="flex items-center ml-8 mt-4">
              <Image
                src="/verifil.png"
                alt="Verifil"
                width={64}
                height={64}
                className="h-16 w-16 rounded-lg"
              />
            </div>

            {/* Get Started Button - Top Right */}
            <Link href="/portfolio" passHref>
              <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition backdrop-blur-sm">
                Get Started
              </button>
            </Link>
          </div>
        </div>

        {/* Content - Left Aligned with Right Image */}
        <div className="w-full relative z-20 flex items-center gap-16 pl-16 pr-12">
          <div className="max-w-2xl text-left flex-shrink-0">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="text-white">Verifil</span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-10 leading-relaxed font-light">
              Advanced blockchain security that protects your crypto investments from scams, honeypots, and risky tokens with real-time analysis.
            </p>
            <div className="flex flex-col gap-4">
              <Link
                href="/wallets"
                className="bg-primary text-primary-foreground px-10 py-4 rounded-xl text-xl font-bold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-2xl w-fit"
              >
                Start Analyzing
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold text-lg backdrop-blur-sm w-fit"
              >
                Watch Demo
              </button>
            </div>
          </div>

          {/* Demonstration Image - Positioned More to the Right */}
          <div className="flex-1 max-w-3xl ml-16">
            <Image
              src="/demonstration.png"
              alt="Verifil Dashboard Demonstration"
              width={800}
              height={600}
              className="w-full h-auto rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Wallets Scanned */}
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {STATS.walletsScanned}
              </div>
              <div className="text-muted-foreground">Wallets Scanned</div>
            </div>
            {/* Scams Detected */}
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {STATS.scamsDetected}
              </div>
              <div className="text-muted-foreground">Scams Detected</div>
            </div>
            {/* Users */}
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {STATS.users}
              </div>
              <div className="text-muted-foreground">Users</div>
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
            <div className="flex items-center gap-2">
              <Image
                src="/verifil.png"
                alt="Verifil"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent text-xl">
                VeriFil
              </span>
            </div>
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
            © 2024 VeriFil. All rights reserved. Built for crypto security.
          </div>
        </div>
      </footer>
    </div>
  )
}