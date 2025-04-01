"use client";

import React from "react";

import Link from "next/link";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  IconBrandGithub,
  IconBrandX,
  IconLayoutDashboard,
  IconRefresh,
  IconCode,
} from "@tabler/icons-react";

import { WSOL_MINT, USDC_MINT } from "@/lib/constants";

import { ModeToggle } from "@/components/web/themes";

import { UserDropdown } from "@/components/sol/user-dropdown";
import { ConnectWalletDialog } from "@/components/sol/connect-wallet-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { ThemeSelector } from "@/components/web/themes";

import { SolAsset } from "@/lib/types";
import { fetchAssets } from "@/lib/assets/umi";

const userAssets = [WSOL_MINT, USDC_MINT];

type HeaderProps = {
  showSidebarTrigger?: boolean;
};

const Header = ({ showSidebarTrigger = false }: HeaderProps) => {
  const { connected, publicKey, connecting } = useWallet();
  const { connection } = useConnection();
  const [demoDropdownOpen, setDemoDropdownOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [assets, setAssets] = React.useState<SolAsset[]>([]);

  const fetchData = React.useCallback(async () => {
    const fetchedAssets = await fetchAssets({
      addresses: userAssets,
      owner: publicKey ?? undefined,
      connection,
    });
    setAssets(fetchedAssets);
  }, [publicKey, connection]);

  React.useEffect(() => {
    setIsMounted(!connecting);
  }, [connecting]);

  React.useEffect(() => {
    if (assets.length) return;
    fetchData();
  }, [fetchData, assets]);

  return (
    <header className="flex h-16 w-full items-center border-b border-border">
      <div className="flex w-full items-center justify-between gap-6 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          {showSidebarTrigger && <SidebarTrigger />}
          <Link href="/" className="mr-auto">
            <h1 className="flex items-center gap-2 text-3xl font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-300/90 to-violet-500/90">
                <IconCode size={22} className="text-white" />
              </div>
              <span>SolanaUI</span>
            </h1>
          </Link>
        </div>
        <nav className="flex items-center gap-4 font-mono lg:gap-10">
          <ul className="hidden items-center gap-10 lg:flex">
            <li>
              <Link
                href="/docs"
                className="hidden text-sm text-muted-foreground transition-colors hover:text-primary xl:block"
              >
                Get started
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
          {!isMounted || (connected && publicKey) ? (
            <UserDropdown address={publicKey} assets={assets} />
          ) : (
            <ConnectWalletDialog
              title={
                <span className="text-4xl dark:bg-gradient-to-r dark:from-teal-200 dark:to-violet-500 dark:bg-clip-text dark:text-transparent">
                  SolanaUI
                </span>
              }
              description={
                <span className="font-mono">
                  Connect your wallet to continue
                </span>
              }
            />
          )}
          <ul className="hidden items-center gap-4 lg:flex">
            <li>
              <Link
                href="https://github.com/chambaz/solanaui"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandGithub size={18} />
              </Link>
            </li>
            <li>
              <Link
                href="https://x.com/chambaz"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandX size={18} />
              </Link>
            </li>
            <li>
              <ModeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export { Header };
