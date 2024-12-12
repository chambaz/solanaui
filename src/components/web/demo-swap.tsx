"use client";

import React from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { IconArrowUp, IconArrowDown } from "@tabler/icons-react";

import { ExtendedDigitalAsset } from "@/hooks/use-assets";

import { TokenInput } from "@/components/sol/token-input";

import { Button } from "@/components/ui/button";

type DemoSwapProps = {
  tokens: PublicKey[];
};

const DemoSwap = ({ tokens }: DemoSwapProps) => {
  const [tokenFrom, setTokenFrom] = React.useState<ExtendedDigitalAsset | null>(
    null,
  );
  const [tokenTo, setTokenTo] = React.useState<ExtendedDigitalAsset | null>(
    null,
  );
  const [amountFrom, setAmountFrom] = React.useState<number>(0);
  const [amountTo, setAmountTo] = React.useState<number>(0);
  const { publicKey } = useWallet();

  const handleSwap = () => {
    console.log("Swap!");
    console.log("Token From", tokenFrom);
    console.log("Token To", tokenTo);
    console.log("Amount From", amountFrom);
    console.log("Amount To", amountTo);
  };

  return (
    <div>
      <div className="mb-12 space-y-3 text-center">
        <h1 className="text-3xl">Swap Demo</h1>
        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
      </div>
      <div className="rounded-lg border p-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <TokenInput
            tokens={tokens}
            owner={publicKey}
            onTokenSelect={setTokenFrom}
            onAmountChange={setAmountFrom}
          />
          <div className="flex gap-2">
            <IconArrowUp size={18} />
            <IconArrowDown size={18} />
          </div>
          <TokenInput
            tokens={tokens}
            owner={publicKey}
            disabled={true}
            showWalletBalance={false}
            showQuickAmountButtons={false}
            onTokenSelect={setTokenTo}
            onAmountChange={setAmountTo}
          />
        </div>
        <Button className="mt-4 w-full" onClick={handleSwap}>
          Swap
        </Button>
      </div>
    </div>
  );
};

export { DemoSwap };
