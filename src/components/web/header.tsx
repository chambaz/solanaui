"use client";

import React from "react";

import Link from "next/link";

import { useWallet } from "@solana/wallet-adapter-react";
import {
  IconBrandGithub,
  IconBrandX,
  IconMenu,
  IconLayoutDashboard,
  IconRefresh,
} from "@tabler/icons-react";

import { WSOL_MINT, USDC_MINT } from "@/lib/constants";

import { ConnectWallet } from "@/components/web/connect-wallet";
import { ModeToggle } from "@/components/web/themes";

import { UserDropdown } from "@/components/sol/user-dropdown";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
];

const userTokens = [WSOL_MINT, USDC_MINT];

const Header = () => {
  const { connected, publicKey } = useWallet();
  const [demoDropdownOpen, setDemoDropdownOpen] = React.useState(false);

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
            <li>
              <DropdownMenu
                open={demoDropdownOpen}
                onOpenChange={setDemoDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <button className="text-sm text-muted-foreground outline-none transition-colors hover:text-primary">
                    Demo
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  side="bottom"
                  align="center"
                  sideOffset={12}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setDemoDropdownOpen(false)}
                    >
                      <Link
                        href="/demo"
                        className="flex w-full cursor-pointer items-center gap-2"
                      >
                        <IconLayoutDashboard size={16} />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDemoDropdownOpen(false)}
                    >
                      <Link
                        href="/demo?view=swap"
                        className="flex w-full cursor-pointer items-center gap-2"
                      >
                        <IconRefresh size={16} />
                        <span>Swap</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
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
