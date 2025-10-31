'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ToastProps {
  message: string
  duration?: number
  onClose?: () => void
  shouldExit?: boolean
}
//empty
export default function Toast({ message, duration = 10000, onClose, shouldExit = false }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  // Handle auto-dismiss timer
  useEffect(() => {
    if (duration > 0 && !isExiting) {
      const timer = setTimeout(() => {
        setIsExiting(true)
        setTimeout(() => {
          setIsVisible(false)
          onClose?.()
        }, 300)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose, isExiting])

  // Handle external exit trigger
  useEffect(() => {
    if (shouldExit && !isExiting) {
      setIsExiting(true)
      setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, 300)
    }
  }, [shouldExit, onClose, isExiting])

  if (!isVisible) return null

  return (
    <>
      <style jsx global>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .toast-enter {
          animation: slideInFromRight 0.5s ease-out;
        }
      `}</style>
      <div
        className={`fixed top-4 right-4 z-50 ${
          isExiting 
            ? 'translate-x-full opacity-0 transition-all duration-300' 
            : 'toast-enter translate-x-0 opacity-100'
        }`}
      >
        <div className="bg-card border border-border rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px] flex items-center gap-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-sm flex-1">{message}</p>
          <button
            onClick={() => {
              setIsExiting(true)
              setTimeout(() => {
                setIsVisible(false)
                onClose?.()
              }, 300)
            }}
            className="flex-shrink-0 p-1 hover:bg-secondary rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}

