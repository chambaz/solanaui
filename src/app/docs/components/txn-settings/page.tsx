"use client";

import { TxnSettings, useTxnSettings } from "@/components/sol/txn-settings";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function TokenCardPage() {
  const { settings } = useTxnSettings();
  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div>
          <ul>
            {settings.priorityFee && (
              <li>Priority fee: {settings.priorityFee}</li>
            )}
            {settings.rpcProvider && (
              <li>RPC provider: {settings.rpcProvider}</li>
            )}
          </ul>
          <TxnSettings
            rpcProviders={[
              {
                name: "RPC 1",
                url: "https://mainnet.solana.com",
              },
              {
                name: "RPC 2",
                url: "https://mainnet.solana.com/two",
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
