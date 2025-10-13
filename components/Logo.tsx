'use client'

import { Shield, CheckCircle } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden`}>
        <Shield className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'} text-white`} />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-white">
          <CheckCircle className="w-1.5 h-1.5 text-white" />
        </div>
      </div>
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent ${textSizes[size]}`}>
          VeriFil
        </span>
      )}
    </div>
  )
}

