'use client'

import React, {useState, useEffect, useRef} from 'react';
import './page.css'
import { ArrowRight, Shield, Eye, TrendingUp, Database, Users, ShieldAlert, Wallet } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from "../components/Logo"

// Custom hook for intersection observer
const useIntersectionObserver = (options: IntersectionObserverInit = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasIntersected) {
        setIsIntersecting(true);
        setHasIntersected(true);
      } else {
        // Keep the visibility state but don't reset the intersection
        setIsIntersecting(entry.isIntersecting);
      }
    }, {
      threshold: 0.3,
      rootMargin: '100px 100px 100px 100px',
      ...options
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options, hasIntersected]);

  return [ref, hasIntersected] as const;
};

// Constants for statistics
const STATS = {
  scamsDetected: '1.3K+',
  users: '1K+',
  walletsScanned: '10K+'
}

export default function LandingPage() {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };
  
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Small delay to prevent flickering
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // if scrolled more than 50px, activate animation
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    // cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Section loading states
  const [stats1Ref, stats1Loaded] = useIntersectionObserver();
  const [stats2Ref, stats2Loaded] = useIntersectionObserver();
  const [stats3Ref, stats3Loaded] = useIntersectionObserver();
  const [featuresRef, featuresLoaded] = useIntersectionObserver();
  const [howItWorksRef, howItWorksLoaded] = useIntersectionObserver();
  const [ctaRef, ctaLoaded] = useIntersectionObserver();
  const [footerRef, footerLoaded] = useIntersectionObserver();

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
        <div id="navbarani" className={`navbar ${isScrolled ? "navbar--scrolled" : ""} absolute top-0 left-0 right-0 z-30 p-6`} >
          <div className="flex justify-between items-center">
            {/* Logo - Top Left with more margin */}
            <div className="mb-8" id='logo-icon'>
              <Link href="/" className="flex items-center gap-2" id='logo-font-size'>
                <Logo  size="md" />
              </Link>
          </div>

            {/* Get Started Button - Top Right */}
            <div style={{display: 'flex', gap: '20px'}}>

              <nav className="navbars">
                <ul>
                  <li className="dropdown" ref={dropdownRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <button className="dropbtn">
                      Logistics
                      <span className={`arrow ${isOpen ? "rotate" : ""}`}>▲</span>
                    </button>

                    {isOpen && (
                      <div className="dropdown-content">
                        <Link href="/portfolio" className="item">
                          <h4>Portfolio Tracking</h4>
                          <p>Sustainable investment metrics.</p>
                        </Link>
                        <Link href="/wallets" className="item">
                          <h4>Wallet Management</h4>
                          <p>Community-verified security practices</p>
                        </Link>
                        <Link href="/transactions" className="item">
                          <h4>Transaction History</h4>
                          <p>Environmental impact tracking</p>
                        </Link>
                      </div>
                    )}
                  </li>

                  <li><Link href="/safety">Safety</Link></li>
                  <li><Link href="/about">About</Link></li>
                </ul>
              </nav>
              <Link href="/portfolio" passHref>
                <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition backdrop-blur-sm animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content - Left Aligned with Right Image */}
        <div style={{justifyContent: 'center'}} className=" w-full relative z-20 flex items-center gap-16 pl-16 pr-12">
          <div className="max-w-2xl text-left flex-shrink-0">
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight hero-text-animation"
              style={{ animationDelay: '0.3s', opacity: 0 }}
            >
              <span className="text-white">Verifil</span>
            </h1>
            <p 
              className="text-xl md:text-2xl text-white mb-10 leading-relaxed font-light hero-text-animation"
              style={{ animationDelay: '0.6s', opacity: 0 }}
            >
              Advanced blockchain security that protects your crypto investments from scams, honeypots, and risky tokens with real-time analysis.
            </p>
            <div 
              className="flex flex-col gap-4 hero-buttons-animation"
              style={{ animationDelay: '0.9s', opacity: 0 }}
            >
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
          <div 
            className="flex-1 max-w-3xl ml-16 hero-image-animation"
            style={{ animationDelay: '0.4s', opacity: 0 }}
          >
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

      {/* Stats Section 1 - Wallets Scanned */}
      <section 
        ref={stats1Ref}
        className={`py-16 bg-muted/30 section-loading ${stats1Loaded ? 'section-loaded' : ''} section-delay-1 `}
        style={{ paddingBottom: '200px', paddingTop: '200px', backgroundColor: '#080808' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col text-center max-w-md mx-auto">
            <div className={`stats-sequential-load ${stats1Loaded ? 'loaded' : ''}`}>
              <div className="flex justify-center mb-6" style={{marginBottom: '0'}}>
                <div className="w-48 h-48 flex items-center justify-center">
                  <Image 
                    src="/walletScan.png" 
                    alt="Wallets Scanned" 
                    width={120} 
                    height={120} 
                    className="drop-shadow-lg brightness-150 contrast-110 saturate-150"
                  />
                </div>
              </div>
              <div className="text-5xl font-bold text-primary mb-3">
                {STATS.walletsScanned}
              </div>
              <div className="text-muted-foreground text-xl">Wallets Scanned</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section 2 - Scams Detected */}
      <section 
        ref={stats2Ref}
        className={`py-16 bg-muted/30 section-loading ${stats2Loaded ? 'section-loaded' : ''} section-delay-2`}
        style={{ paddingBottom: '200px', paddingTop: '200px', backgroundColor: '#080808' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col text-center max-w-md mx-auto">
            <div className={`stats-sequential-load ${stats2Loaded ? 'loaded' : ''}`}>
              <div className="flex justify-center mb-6" style={{marginBottom: '0'}}>
                <div className="w-48 h-48 flex items-center justify-center">
                  <Image 
                    src="/scamDetect.png" 
                    alt="Scams Detected" 
                    width={120} 
                    height={120} 
                    className="drop-shadow-lg brightness-150 contrast-110 saturate-150"
                  />
                </div>
              </div>
              <div className="text-5xl font-bold text-primary mb-3">
                {STATS.scamsDetected}
              </div>
              <div className="text-muted-foreground text-xl">Scams Detected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section 3 - Users */}
      <section 
        ref={stats3Ref}
        className={`py-16 bg-muted/30 section-loading ${stats3Loaded ? 'section-loaded' : ''} section-delay-3`}
        style={{ paddingBottom: '200px', paddingTop: '200px', backgroundColor: '#080808' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col text-center max-w-md mx-auto">
            <div className={`stats-sequential-load ${stats3Loaded ? 'loaded' : ''}`}>
              <div className="flex justify-center mb-6" style={{marginBottom: '0'}}>
                <div className="w-48 h-48 flex items-center justify-center">
                  <Image 
                    src="/user.png" 
                    alt="User" 
                    width={120} 
                    height={120} 
                    className="drop-shadow-lg brightness-150 contrast-110 saturate-150"
                  />
                </div>
              </div>
              <div className="text-5xl font-bold text-primary mb-3">
                {STATS.users}
              </div>
              <div className="text-muted-foreground text-xl">Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        className={`py-20 px-4 sm:px-6 lg:px-8 section-loadings ${featuresLoaded ? 'section-loaded' : ''} section-delay-2`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Verifil?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced blockchain analysis tools to keep your crypto investments safe
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const hoverContent = [
                {
                  title: "Advanced Risk Detection",
                  details: [
                    "Honeypot identification",
                    "Rug pull analysis", 
                    "Token tax verification",
                    "Liquidity lock validation"
                  ]
                },
                {
                  title: "Live Blockchain Data",
                  details: [
                    "Real-time balance updates",
                    "Transaction monitoring",
                    "Gas fee optimization",
                    "Network status tracking"
                  ]
                },
                {
                  title: "Comprehensive Analytics",
                  details: [
                    "Portfolio performance metrics",
                    "Asset allocation insights",
                    "Historical trend analysis",
                    "Risk assessment scoring"
                  ]
                }
              ];
              
              return (
                <div 
                  key={index} 
                  className={`group relative text-center p-6 rounded-lg border border-border hover:bg-secondary/50 transition-all duration-500 hover:scale-105 hover:shadow-lg overflow-hidden ${
                    featuresLoaded ? `feature-card-${index + 1}` : 'feature-card-hidden'
                  }`}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  
                  {/* Hover Content - Hidden until card scales */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 transform scale-95 group-hover:scale-100">
                    <div className="h-full p-6 bg-card/95 backdrop-blur-sm rounded-lg border border-border/50 flex flex-col justify-center">
                      <h4 className="font-semibold text-lg mb-4 text-primary text-center">{hoverContent[index].title}</h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        {hoverContent[index].details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center">
                            <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section 
        ref={howItWorksRef}
        className={`py-20 bg-muted/30 section-loadings ${howItWorksLoaded ? 'section-loaded' : ''} section-delay-3`}
      >
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
            <div className={`text-center ${howItWorksLoaded ? 'how-it-works-card-1' : 'how-it-works-card-hidden'}`}>
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Wallet</h3>
              <p className="text-muted-foreground">
                Add your Ethereum wallet address to start monitoring
              </p>
            </div>
            <div className={`text-center ${howItWorksLoaded ? 'how-it-works-card-2' : 'how-it-works-card-hidden'}`}>
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your holdings for potential risks
              </p>
            </div>
            <div className={`text-center ${howItWorksLoaded ? 'how-it-works-card-3' : 'how-it-works-card-hidden'}`}>
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
      <section 
        ref={ctaRef}
        className={`py-20 px-4 sm:px-6 lg:px-8 section-loadings ${ctaLoaded ? 'section-loaded' : ''} section-delay-4`}
      >
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
      <footer 
        ref={footerRef}
        className={`border-t border-border py-12 px-4 sm:px-6 lg:px-8 section-loadings ${footerLoaded ? 'section-loaded' : ''} section-delay-5`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2">
              <Logo size="md" />
            </Link>
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