"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  IconComponents,
  IconFishHook,
  IconHome,
  IconTools,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navItems = [
  {
    section: "Getting started",
    icon: <IconHome />,
    children: [
      {
        label: "Introduction",
        href: "/docs#getting-started",
      },
      {
        label: "Installation",
        href: "/docs#installation",
      },
      {
        label: "Themes",
        href: "/docs#themes",
      },
    ],
  },
  {
    section: "Components",
    icon: <IconComponents />,
    children: [
      {
        label: "Connect Wallet Dialog",
        href: "/docs/components/connect-wallet-dialog",
      },
      {
        label: "Connect Wallet Popover",
        href: "/docs/components/connect-wallet-popover",
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
        label: "Price Change",
        href: "/docs/components/price-change",
      },
      {
        label: "Sparkline",
        href: "/docs/components/sparkline",
      },
      {
        label: "Price Chart",
        href: "/docs/components/price-chart",
      },
    ],
  },
  {
    section: "Hooks",
    icon: <IconFishHook />,
    children: [
      { label: "useAssets", href: "/docs/hooks/use-assets" },
      { label: "useTxnToast", href: "/docs/hooks/use-txn-toast" },
    ],
  },
  {
    section: "Utils",
    icon: <IconTools />,
    children: [
      { label: "Price data", href: "/docs/utils/price-data" },
      { label: "Token icons", href: "/docs/utils/token-icons" },
      { label: "Formatters", href: "/docs/utils/formatters" },
    ],
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const [hash, setHash] = React.useState("");

  const isLinkActive = React.useCallback(
    (href: string) => {
      // For hash links (like /docs#getting-started)
      if (href.includes("#")) {
        const [pathPart, hashPart] = href.split("#");
        return pathname === pathPart && hash === hashPart;
      }
      // For regular links
      return href === pathname;
    },
    [pathname, hash],
  );

  return (
    <Sidebar>
      <SidebarContent className="pb-8 pt-2">
        {navItems.map((item) => (
          <SidebarGroup key={item.section}>
            <SidebarGroupLabel>
              <div className="flex items-center gap-2 text-sm">
                {React.cloneElement(item.icon, {
                  size: 18,
                })}
                <span>{item.section}</span>
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.children.map((child) => (
                  <SidebarMenuItem key={child.href}>
                    <Collapsible
                      open={isLinkActive(child.href)}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={isLinkActive(child.href)}
                          onClick={() => {
                            if (child.href.includes("#")) {
                              setHash(child.href.split("#")[1]);
                            } else {
                              setHash("");
                            }
                          }}
                          asChild
                        >
                          <Link href={child.href}>{child.label}</Link>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {item.section === "Components" && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link href={`${child.href}#demo`}>Demo</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link href={`${child.href}#installation`}>
                                  Installation
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link href={`${child.href}#props`}>Props</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export { AppSidebar };
