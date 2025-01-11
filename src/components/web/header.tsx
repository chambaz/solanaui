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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { ThemeSelector } from "@/components/web/themes";

const userTokens = [WSOL_MINT, USDC_MINT];

type HeaderProps = {
  showSidebarTrigger?: boolean;
};

const Header = ({ showSidebarTrigger = false }: HeaderProps) => {
  const { connected, publicKey, connecting } = useWallet();
  const [demoDropdownOpen, setDemoDropdownOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(!connecting);
  }, [connecting]);

  return (
    <header className="flex h-16 w-full items-center border-b border-border">
      <div className="flex w-full items-center justify-between gap-6 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          {showSidebarTrigger && <SidebarTrigger />}
          <Link href="/" className="mr-auto">
            <h1 className="text-3xl font-semibold">SolanaUI</h1>
          </Link>
        </div>
        <nav className="flex items-center gap-4 font-mono lg:gap-10">
          <ul className="hidden items-center gap-10 lg:flex">
            <li>
              <Link
                href="/docs"
                className="hidden text-sm text-muted-foreground transition-colors hover:text-primary xl:block"
              >
                Getting started
              </Link>
            </li>
            <li>
              <Link
                href="/docs/components/connect-wallet-dialog"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Components
              </Link>
            </li>
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
          {!isMounted ? (
            <Skeleton className="h-[42px] w-[42px] rounded-full" />
          ) : (
            <>
              {connected && publicKey ? (
                <UserDropdown address={publicKey} tokens={userTokens} />
              ) : (
                <ConnectWallet />
              )}
            </>
          )}
          <ul className="hidden items-center gap-4 lg:flex">
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
          <Button variant="ghost" size="icon" className="lg:hidden">
            <IconMenu size={18} />
          </Button>
        </nav>
      </div>
    </header>
  );
};

export { Header };
