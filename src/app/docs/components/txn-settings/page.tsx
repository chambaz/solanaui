"use client";

import React from "react";

import { getComponentSource } from "@/actions/get-component-source";

import { TxnSettings, useTxnSettings } from "@/components/sol/txn-settings";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function TokenCardPage() {
  const { settings } = useTxnSettings();
  const [componentSource, setComponentSource] = React.useState("");

  React.useEffect(() => {
    getComponentSource("src/components/sol/txn-settings.tsx").then(
      setComponentSource,
    );
  }, []);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="flex flex-col items-center justify-center gap-4">
          <ul>
            {settings.priorityFee && (
              <li>
                <strong className="text-primary">Priority fee</strong>:{" "}
                {settings.priorityFee}
              </li>
            )}
            {settings.rpcProvider && (
              <li>
                <strong className="text-primary">RPC provider</strong>:{" "}
                {settings.rpcProvider}
              </li>
            )}
          </ul>
          <TxnSettings
            rpcProviders={[
              {
                name: "RPC 1",
                url: process.env.NEXT_PUBLIC_RPC_URL!,
              },
              {
                name: "RPC 2",
                url: "https://mainnet.solana.com",
              },
            ]}
          />
        </div>
      ),
      code: `import { TxnSettings } from "@/components/sol/txn-settings"

export function TxnSettingsDemo() {
  return (
    <TxnSettings />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
