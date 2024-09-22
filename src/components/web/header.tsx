"use client";

import Link from "next/link";

import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";

import {
  ConnectWalletDialog,
  ConnectWalletDialogTrigger,
  ConnectWalletDialogHeader,
  ConnectWalletDialogTitle,
  ConnectWalletDialogDescription,
  ConnectWalletDialogContent,
} from "@/components/sol/connect-wallet-dialog";

import { Button } from "@/components/ui/button";

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
    label: "examples",
    href: "/examples",
  },
];

const Header = () => {
  return (
    <header className="flex h-16 items-center border-b border-border px-8">
      <div className="flex w-full items-center justify-between gap-6">
        <Link href="/" className="mr-auto">
          <h1 className="text-3xl font-semibold">SolanaUI</h1>
        </Link>
        <nav className="flex items-center gap-10 font-mono">
          <ul className="flex items-center gap-10">
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
          </ul>
          <ConnectWalletDialog>
            <ConnectWalletDialogTrigger asChild>
              <Button>Connect Wallet</Button>
            </ConnectWalletDialogTrigger>
            <ConnectWalletDialogContent>
              <ConnectWalletDialogHeader>
                <ConnectWalletDialogTitle>
                  Connect Wallet custom title
                </ConnectWalletDialogTitle>
                <ConnectWalletDialogDescription>
                  Connect your wallet to continue
                </ConnectWalletDialogDescription>
              </ConnectWalletDialogHeader>
            </ConnectWalletDialogContent>
          </ConnectWalletDialog>
          <ul className="flex items-center gap-4">
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
          </ul>
        </nav>
      </div>
    </header>
  );
};

export { Header };
