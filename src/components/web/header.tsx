"use client";

import Link from "next/link";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTheme } from "next-themes";
import {
  IconBrandGithub,
  IconBrandX,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";

import { ConnectWallet } from "@/components/web/connect-wallet";

import { UserDropdown } from "@/components/sol/user-dropdown";

import { Toggle } from "@/components/ui/toggle";

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

const userTokens = [
  new PublicKey("So11111111111111111111111111111111111111112"),
  new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
];

const Header = () => {
  const { connected, publicKey } = useWallet();
  const { theme, setTheme } = useTheme();

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
          {connected && publicKey ? (
            <UserDropdown address={publicKey} tokens={userTokens} />
          ) : (
            <ConnectWallet />
          )}
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
            <li>
              <Toggle
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? (
                  <IconSun size={18} />
                ) : (
                  <IconMoon size={18} />
                )}
              </Toggle>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export { Header };
