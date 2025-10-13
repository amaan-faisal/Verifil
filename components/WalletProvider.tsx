'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WalletData } from '@/lib/api';

interface WalletContextType {
  wallets: WalletData[];
  setWallets: (w: WalletData[]) => void;
  addWallet: (w: WalletData) => void;
  removeWallet: (address: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallets() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallets must be used in <WalletProvider>');
  return ctx;
}

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<WalletData[]>([]);

  const addWallet = (wallet: WalletData) => {
    setWallets(prev => prev.find(w => w.address === wallet.address) ? prev : [...prev, wallet]);
  };
  const removeWallet = (address: string) => {
    setWallets(prev => prev.filter(w => w.address !== address));
  };

  return (
    <WalletContext.Provider value={{ wallets, setWallets, addWallet, removeWallet }}>
      {children}
    </WalletContext.Provider>
  );
}
