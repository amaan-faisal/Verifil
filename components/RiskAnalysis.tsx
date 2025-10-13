'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Shield, CheckCircle, XCircle, Info } from 'lucide-react'
import { walletApi, RiskAnalysis as RiskAnalysisData } from '@/lib/api'
import { getRiskColor, getRiskBgColor } from '@/lib/utils'

interface RiskAnalysisProps {
  address: string
}

export default function RiskAnalysis({ address }: RiskAnalysisProps) {
  const [analysis, setAnalysis] = useState<RiskAnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (address) {
      fetchRiskAnalysis()
    }
  }, [address])

  const fetchRiskAnalysis = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await walletApi.getRiskAnalysis(address)
      setAnalysis(data)
    } catch (error) {
      console.error('Error fetching risk analysis:', error)
      setAnalysis(null)
      // Friendly message for common 4xx errors
      setError('Unable to analyze risk for this wallet right now. It may be an invalid/unsupported address or the API rate limit was hit. Please try again in a moment.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Risk Analysis</h3>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Risk Analysis</h3>
        <div className="bg-card border border-border rounded-lg p-4">
          {error ? (
            <div className="flex items-start justify-between gap-4">
              <div className="text-sm text-red-400">
                {error}
              </div>
              <button
                onClick={fetchRiskAnalysis}
                className="text-sm px-3 py-1 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No analysis yet. Click Refresh to generate one.</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Risk Analysis</h3>
        <button
          onClick={fetchRiskAnalysis}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Refresh
        </button>
      </div>

      {/* Risk Score */}
      <div className={`p-4 rounded-lg border ${getRiskBgColor(analysis.risk_level)}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            analysis.risk_level === 'SAFE' ? 'bg-green-500' :
            analysis.risk_level === 'LOW' ? 'bg-yellow-500' :
            analysis.risk_level === 'MEDIUM' ? 'bg-orange-500' :
            analysis.risk_level === 'HIGH' ? 'bg-red-500' :
            'bg-red-600'
          }`}>
            {analysis.risk_level === 'SAFE' ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-white" />
            )}
          </div>
          <div>
            <div className={`font-semibold ${getRiskColor(analysis.risk_level)}`}>
              {analysis.risk_level} RISK
            </div>
            <div className="text-sm text-muted-foreground">
              Score: {analysis.risk_score}/100
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Analyzed {analysis.tokens_analyzed} tokens • {analysis.risky_tokens_count} risky
        </div>
      </div>

      {/* Risky Tokens */}
      {analysis.risky_tokens.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-destructive">Risky Tokens</h4>
          {analysis.risky_tokens.map((token, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-sm text-muted-foreground">({token.name})</span>
                </div>
                <div className={`text-sm font-medium ${getRiskColor(analysis.risk_level)}`}>
                  Risk: {token.risk_score}/100
                </div>
              </div>
              <div className="space-y-1">
                {token.risk_flags.map((flag, flagIndex) => (
                  <div key={flagIndex} className="flex items-center gap-2 text-sm">
                    <XCircle className="w-3 h-3 text-destructive" />
                    <span className="text-destructive">{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Recommendations</h4>
          <div className="space-y-2">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.risk_level === 'SAFE' && (
        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400">Your wallet looks healthy!</span>
        </div>
      )}
    </div>
  )
}
