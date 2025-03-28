"use client";

import React from "react";

import { motion } from "motion/react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Code } from "@/components/web/code";

const codeExamples = {
  connectWallet: `<ConnectWalletDialog 
  trigger={<Button>Connect Wallet</Button>} 
  title="Connect Wallet" 
  description="Connect your wallet to continue" 
/>`,
  fetchAssets: `import { fetchAssets } from "@/lib/assets"

const assets = await fetchAssets({
  addresses: [
    WSOL_MINT,
    USDC_MINT,
    new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
    new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
  ],
  owner: publicKey ?? undefined,
});
`,
  tokenCombobox: `import { fetchAssets, searchAssets } from "@/lib/assets"

const assets = await fetchAssets({
  addresses: [
    WSOL_MINT,
    USDC_MINT,
    new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
    new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
  ],
  owner: publicKey ?? undefined,
});

return (
  <TokenCombobox
    assets={assets}
    onSearch={searchAssets}
    showBalances
  />
)`,
};

const CodeShowcase = () => {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-24">
      <motion.h2
        className="mb-6 text-center text-3xl font-bold xl:text-4xl"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5 }}
      >
        Simple, Copy & Paste Components
      </motion.h2>
      <motion.p
        className="mx-auto mb-12 max-w-4xl text-center text-muted-foreground xl:text-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        No complex installation or configuration. Just copy the components you
        need directly into your project.
      </motion.p>

      <motion.div
        className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <Tabs defaultValue="connectWallet" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="connectWallet">
                ConnectWalletDialog
              </TabsTrigger>
              <TabsTrigger value="fetchAssets">Fetch Assets</TabsTrigger>
              <TabsTrigger value="tokenCombobox">TokenCombobox</TabsTrigger>
            </TabsList>
            <TabsContent value="connectWallet" className="pt-1">
              <Code
                code={codeExamples.connectWallet}
                language="tsx"
                showControls={false}
              />
            </TabsContent>
            <TabsContent value="fetchAssets" className="pt-1">
              <Code
                code={codeExamples.fetchAssets}
                language="tsx"
                showControls={false}
              />
            </TabsContent>
            <TabsContent value="tokenCombobox" className="pt-1">
              <Code
                code={codeExamples.tokenCombobox}
                language="tsx"
                showControls={false}
              />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export { CodeShowcase };
