"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar"; // Import the useSidebar hook

import { IconComponents, IconHome, IconTools } from "@tabler/icons-react";

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
import { Badge } from "@/components/ui/badge";

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
      {
        label: "Fetching Data",
        href: "/docs#fetching-data",
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
      { label: "Wallet", href: "/docs/components/wallet", new: true },
      {
        label: "Token Card",
        href: "/docs/components/token-card",
      },
      {
        label: "Token List",
        href: "/docs/components/token-list",
      },
      { label: "Token Combobox", href: "/docs/components/token-combobox" },
      {
        label: "Token Icon",
        href: "/docs/components/token-icon",
      },
      { label: "Token Input", href: "/docs/components/token-input" },
      { label: "Swap", href: "/docs/components/swap", new: true },
      { label: "PK Input", href: "/docs/components/pk-input" },
      {
        label: "Txn List",
        href: "/docs/components/txn-list",
      },
      {
        label: "Txn Toast",
        href: "/docs/components/txn-toast",
        hasAPI: true,
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
    section: "Utils",
    icon: <IconTools />,
    children: [
      { label: "Assets", href: "/docs/utils/assets" },
      { label: "Prices", href: "/docs/utils/prices" },
      { label: "Helpers", href: "/docs/utils/helpers" },
    ],
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const [hash, setHash] = React.useState("");
  const { setOpenMobile } = useSidebar(); // Get the setOpenMobile function from the useSidebar hook

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
      <SidebarContent className="bg-background pb-8 pt-2">
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
                            setOpenMobile(false); // Close mobile sidebar when item is clicked
                          }}
                          asChild
                        >
                          <Link href={child.href}>
                            {child.label}
                            {child.new && (
                              <Badge className="bg-lime-300 px-1.5 py-px text-xs text-neutral-900 hover:bg-lime-300 hover:text-neutral-900">
                                new
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {item.section === "Components" && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={`${child.href}#demo`}
                                  onClick={() => setOpenMobile(false)}
                                >
                                  Demo
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={`${child.href}#installation`}
                                  onClick={() => setOpenMobile(false)}
                                >
                                  Installation
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            {child.hasAPI ? (
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild>
                                  <Link
                                    href={`${child.href}#api`}
                                    onClick={() => setOpenMobile(false)}
                                  >
                                    API
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ) : (
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild>
                                  <Link
                                    href={`${child.href}#props`}
                                    onClick={() => setOpenMobile(false)}
                                  >
                                    Props
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}

                      {item.section === "Utils" && child.label === "Assets" && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={`${child.href}#types`}
                                  onClick={() => setOpenMobile(false)}
                                >
                                  Setup
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={`${child.href}#fetchassets`}
                                  onClick={() => setOpenMobile(false)}
                                >
                                  fetchAssets
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={`${child.href}#fetchwalletassets`}
                                  onClick={() => setOpenMobile(false)}
                                >
                                  fetchWalletAssets
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={`${child.href}#fetchTrendingAssets`}
                                  onClick={() => setOpenMobile(false)}
                                >
                                  fetchTrendingAssets
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={`${child.href}#searchassets`}
                                  onClick={() => setOpenMobile(false)}
                                >
                                  searchAssets
                                </Link>
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
