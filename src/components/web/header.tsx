"use client";

import React from "react";

import Link from "next/link";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { IconBrandGithub, IconBrandX, IconMenu } from "@tabler/icons-react";

import { ConnectWallet } from "@/components/web/connect-wallet";
import { ModeToggle } from "@/components/web/themes";

import { UserDropdown } from "@/components/sol/user-dropdown";

import { Button } from "@/components/ui/button";

import { ThemeSelector } from "@/components/web/themes";

const navItems = [
  {
    label: "get started",
    href: "/docs",
  },
  {
    label: "components",
    href: "/docs/components/connect-wallet-dialog",
  },
  {
    label: "demo",
    href: "/demo",
  },
];

const userTokens = [
  new PublicKey("So11111111111111111111111111111111111111112"),
  new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
];

const Header = () => {
  const { connected, publicKey } = useWallet();

  return (
    <header className="flex h-16 items-center border-b border-border px-4 md:px-8">
      <div className="flex w-full items-center justify-between gap-6">
        <Link href="/" className="mr-auto">
          <h1 className="text-3xl font-semibold">SolanaUI</h1>
        </Link>
        <nav className="flex items-center gap-4 font-mono md:gap-10">
          <ul className="hidden items-center gap-10 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center">
              <ThemeSelector />
            </li>
          </ul>
          {connected && publicKey ? (
            <UserDropdown address={publicKey} tokens={userTokens} />
          ) : (
            <ConnectWallet />
          )}
          <ul className="hidden items-center gap-4 md:flex">
            <li>
              <Link href="">
                <IconBrandGithub size={18} />
              </Link>
            </li>
            <li>
              <Link href="">
                <IconBrandX size={18} />
              </Link>
            </li>
            <li>
              <ModeToggle />
            </li>
          </ul>
          <Button variant="ghost" size="icon" className="md:hidden">
            <IconMenu size={18} />
          </Button>
        </nav>
      </div>
    </header>
  );
};

export { Header };
