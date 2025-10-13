'use client'

import { Info } from 'lucide-react'

export default function DeleteInstructions() {
  return (
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <div className="font-medium text-blue-400 mb-1">Wallet Management</div>
          <div className="text-muted-foreground">
            <strong>Right-click</strong> on any wallet card to access the delete option. 
            You can also hover over wallets to see the options menu icon.
          </div>
        </div>
      </div>
    </div>
  )
}

