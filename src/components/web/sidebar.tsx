"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  {
    section: "Getting started",
    children: [
      {
        label: "Introduction",
        href: "/docs",
      },
      {
        label: "Installation",
        href: "/docs/installation",
      },
      {
        label: "Themes",
        href: "/docs/themes",
      },
    ],
  },
  {
    section: "Components",
    children: [
      {
        label: "Connect Wallet Dialog",
        href: "/docs/components/connect-wallet-dialog",
      },
      { label: "Avatar", href: "/docs/components/avatar" },
      { label: "User Dropdown", href: "/docs/components/user-dropdown" },

      {
        label: "NFT Card",
        href: "/docs/components/nft-card",
      },
      {
        label: "Token Card",
        href: "/docs/components/token-card",
      },
      {
        label: "Token List",
        href: "/docs/components/token-list",
      },
      { label: "Token Combobox", href: "/docs/components/token-combobox" },
      { label: "Token Input", href: "/docs/components/token-input" },
      {
        label: "Token Icon",
        href: "/docs/components/token-icon",
      },
      {
        label: "Txn List",
        href: "/docs/components/txn-list",
      },
      {
        label: "Txn Toast",
        href: "/docs/components/txn-toast",
      },
      {
        label: "Txn Settings",
        href: "/docs/components/txn-settings",
      },
      {
        label: "Price Chart",
        href: "/docs/components/price-chart",
      },
    ],
  },
  {
    section: "Hooks",
    children: [
      { label: "useAssets", href: "/docs/hooks/use-assets" },
      { label: "useTxnToast", href: "/docs/hooks/use-txn-toast" },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="h-full min-w-52 overflow-auto pr-4">
      <nav>
        <ul className="space-y-4">
          {navItems.map((item, index) => (
            <li key={index} className="text-sm font-medium text-primary">
              {item.section}
              <ul className="mb-6 mt-2 space-y-2">
                {item.children.map((child, index) => (
                  <li key={index}>
                    <Link
                      href={child.href}
                      className={cn(
                        "block py-1 text-xs text-muted-foreground transition-colors hover:text-primary",
                        child.href === pathname && "text-primary",
                      )}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export { Sidebar };
