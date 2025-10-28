'use client'

import Image from 'next/image'

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
      <div className={`${sizeClasses[size]} relative overflow-hidden rounded-lg logo-rise-fall`}>
        <Image 
          src="/verifil.webp" 
          alt="Verifil Logo" 
          fill
          className="object-cover"
          priority
        />
      </div>
      {showText && (
        <span style={{marginLeft: '10px', fontSize: '25px;'}} className={`font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent ${textSizes[size]}`}>
          Verifil
        </span>
      )}
    </div>
  )
}

