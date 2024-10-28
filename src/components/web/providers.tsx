"use client";

import React from "react";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  UnsafeBurnerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { TxnSettingsProvider } from "@/components/sol/txn-settings";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const wallets = React.useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new UnsafeBurnerWalletAdapter(),
    ],
    [],
  );
  return (
    <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_RPC_URL as string}>
      <WalletProvider wallets={wallets} autoConnect>
        <TxnSettingsProvider>
          <NextThemesProvider attribute="class" defaultTheme="system">
            {children}
          </NextThemesProvider>
        </TxnSettingsProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export { Providers };
