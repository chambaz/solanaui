"use client";

import React from "react";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { TxnSettingsProvider } from "@/components/sol/txn-settings";
import { ThemeProvider } from "@/components/web/themes";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_RPC_URL as string}>
      <WalletProvider wallets={[]} autoConnect>
        <TxnSettingsProvider>
          <ThemeProvider>
            <NextThemesProvider
              attribute="class"
              defaultTheme="system"
              enableSystem={true}
            >
              {children}
            </NextThemesProvider>
          </ThemeProvider>
        </TxnSettingsProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export { Providers };
