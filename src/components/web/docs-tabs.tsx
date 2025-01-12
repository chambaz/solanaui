"use client";

import React from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import ColdDark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";
import { IconRocket } from "@tabler/icons-react";

import { ConnectWallet } from "@/components/web/connect-wallet";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

type DocsVariant = {
  value: string;
  label?: string;
  preview?: React.ReactNode;
  code?: string;
};

type DocsTabsProps = {
  variants: DocsVariant[];
  showConnectWalletAlert?: boolean;
};

SyntaxHighlighter.registerLanguage("jsx", jsx);

const DocsTabs = ({
  variants,
  showConnectWalletAlert = true,
}: DocsTabsProps) => {
  const { connected, connecting } = useWallet();
  const [activeVariantIndex, setActiveVariantIndex] = React.useState<number>(0);
  const [activeVariant, setActiveVariant] = React.useState<DocsVariant>(
    variants[activeVariantIndex],
  );
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    setActiveVariant(variants[activeVariantIndex]);
  }, [variants, activeVariantIndex]);

  return (
    <div className="mt-6 space-y-6">
      {!connected && !connecting && isMounted && showConnectWalletAlert && (
        <Alert>
          <IconRocket size={20} />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            <ConnectWallet>
              <button className="border-b border-primary text-primary">
                Connect your wallet
              </button>
            </ConnectWallet>{" "}
            to enable all example features and demos.
          </AlertDescription>
        </Alert>
      )}
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <div className="relative rounded-lg border border-border bg-background">
            <div className="px-6 py-4">
              {variants.length > 1 && (
                <div className="flex items-center gap-2">
                  <Label>Variant:</Label>
                  <Select
                    defaultValue={activeVariantIndex.toString()}
                    onValueChange={(value) => {
                      setActiveVariantIndex(parseInt(value));
                    }}
                  >
                    <SelectTrigger className="w-[190px]">
                      <SelectValue placeholder="Select a variant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {variants.map((variant, index) => (
                          <SelectItem
                            key={index.toString()}
                            value={index.toString()}
                          >
                            {variant.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="relative flex w-full items-center justify-center pb-32 pt-24">
                {activeVariant.preview && activeVariant.preview}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <div className="rounded-lg bg-[#131B26] text-sm">
            {activeVariant.code && (
              <SyntaxHighlighter language="jsx" style={ColdDark} wrapLines>
                {activeVariant.code}
              </SyntaxHighlighter>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { DocsTabs };
export type { DocsVariant };
