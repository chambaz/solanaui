import type { Metadata } from "next";

import { IconWallet } from "@tabler/icons-react";

import { ConnectWalletPopover } from "@/components/sol/connect-wallet-popover";

import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { Code } from "@/components/web/code";
import { PropsTable } from "@/components/web/props-table";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Connect Wallet Popover - SolanaUI",
};

export default function ConnectWalletPopoverPage() {
  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <ConnectWalletPopover
          trigger={
            <Button size="icon">
              <IconWallet size={18} />
            </Button>
          }
          title="Connect Wallet"
          description="Connect your wallet to continue"
        />
      ),
      code: `import { ConnectWallet } from "@/components/web/connect-wallet"

export function ConnectWalletDialogDemo() {
  return (
    <ConnectWalletPopover
      trigger={
        <Button size="icon">
          <IconWallet size={18} />
        </Button>
      }
      title="Connect Wallet"
      description="Connect your wallet to continue"
    />
  )
}`,
    },
  ];

  return (
    <DocsWrapper>
      <div id="demo">
        <div className="space-y-2">
          <h1 className="text-3xl font-medium">Connect Wallet Popover</h1>
          <p className="text-muted-foreground">
            The Connect Wallet Popover component is a popover dialog that allows
            users to connect their wallet to your app via Solana Wallet Adapter.
          </p>
        </div>
        <DocsTabs variants={variants} />
        <div
          className="prose w-full max-w-none pt-8 dark:prose-invert"
          id="installation"
        >
          <h2>Installation</h2>
          <p>
            Deserunt cillum qui anim consectetur quis deserunt occaecat. Fugiat
            commodo fugiat tempor laboris dolor. Excepteur eiusmod ex nostrud
            dolore in pariatur exercitation consequat sit consequat ipsum ut
            aliqua.
          </p>

          <h3 className="text-lg">1. Install Dependencies</h3>
          <p>
            ConnectWalletDialog requires shadcn/ui dialog component and Solana
            Wallet Adapter.
          </p>
          <Code
            language="bash"
            pinnedControls={false}
            code={`npm install @radix-ui/react-popover @solana/wallet-adapter-react @solana/wallet-adapter-wallets @solana/wallet-adapter-react-ui`}
          />

          <h3 className="text-lg">2. Install shadcn/ui popover component</h3>
          <p>
            Use shadcn/ui CLI or manually copy the code below to{" "}
            <code>src/components/ui/popover.tsx</code>.
          </p>
          <Code
            reveal={false}
            code={`"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
`}
          />

          <h3 className="text-lg">
            3. Install SolanaUI Connect Wallet Popover
          </h3>
          <p>
            Copy the code below to{" "}
            <code>src/components/sol/connect-wallet-popover.tsx</code>.
          </p>
          <Code
            reveal={false}
            code={`"use client";

import React from "react";
import Image from "next/image";
import { Wallet } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { IconLoader2, IconWallet } from "@tabler/icons-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type ConnectWalletPopoverProps = {
  trigger?: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<typeof PopoverContent>, "children">;

const ConnectWalletPopover = ({
  trigger,
  title,
  description,
  ...popoverProps
}: ConnectWalletPopoverProps) => {
  const { wallets, select, connecting, wallet } = useWallet();

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger || (
          <Button size="icon">
            <IconWallet size={18} />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-6" align={"center"} {...popoverProps}>
        <div className="flex flex-col gap-4">
          {title && (
            <div className="space-y-2">
              <h3 className="font-semibold leading-none">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          )}
          <ul className="flex flex-col gap-2">
            {wallets.map((walletItem: Wallet) => (
              <li key={walletItem.adapter.name}>
                <Button
                  variant="secondary"
                  className="w-full justify-start gap-2"
                  onClick={() => select(walletItem.adapter.name)}
                  disabled={connecting}
                >
                  <Image
                    src={walletItem.adapter.icon}
                    alt={walletItem.adapter.name}
                    width={20}
                    height={20}
                  />
                  {walletItem.adapter.name}
                  {connecting &&
                    wallet?.adapter.name === walletItem.adapter.name && (
                      <IconLoader2 size={16} className="ml-auto animate-spin" />
                    )}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { ConnectWalletPopover };
`}
          />

          <h3 className="text-lg">4. Use Connect Wallet Popover</h3>
          <p>
            Import the <code>ConnectWalletPopover</code> component and use it in
            your app.
          </p>
          <Code
            reveal={true}
            code={`<ConnectWalletPopover
  trigger={
    <Button size="icon">
      <IconWallet size={18} />
    </Button>
  }
  title="Connect Wallet"
  description="Connect your wallet to continue"
/>`}
          />

          <div className="!space-y-0" id="props">
            <h2 className="!mb-0">Props</h2>
            <PropsTable
              data={[
                {
                  name: "trigger",
                  type: "React.ReactNode",
                  default: `<Button>Connect Wallet</Button>`,
                },
                {
                  name: "title",
                  type: "string | React.ReactNode",
                  default: `"Connect Wallet"`,
                },
                {
                  name: "description",
                  type: "string | React.ReactNode",
                  default: `"Connect your wallet to continue"`,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </DocsWrapper>
  );
}
