import { ArrowDownUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TokenInput } from "@/components/sol/token-input";

export default function SwapPage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1">
      <div className="max-w-lg mx-auto w-full flex flex-col gap-4">
        <h1 className="text-4xl font-medium mb-4">SolanaUI Swap</h1>
        <div className="flex flex-col gap-4 items-center">
          <TokenInput />
          <div>
            <ArrowDownUpIcon className="size-4" />
          </div>
          <TokenInput />
        </div>
        <Button>Swap</Button>
      </div>
    </div>
  );
}
