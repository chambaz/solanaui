"use client";

import React from "react";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { TxnSettingsProvider } from "@/components/sol/txn-settings";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_RPC_URL as string}>
      <WalletProvider wallets={[]} autoConnect>
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
