"use client";

import React from "react";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const wallets = React.useMemo(() => [new UnsafeBurnerWalletAdapter()], []);
  return (
    <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_RPC_URL as string}>
      <WalletProvider wallets={wallets}>{children}</WalletProvider>
    </ConnectionProvider>
  );
};

export { Providers };
