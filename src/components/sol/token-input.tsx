import { WalletIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

import { TokenCombobox } from "@/components/sol/token-combobox";
import { Button } from "../ui/button";

const tokens = [
  {
    icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png",
    symbol: "SOL",
  },
  {
    icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/LSTxxxnJzKDFSLr4dUkPcmCf5VyryEqzPLz5j4bpxFp.png",
    symbol: "LST",
  },
  {
    icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn.png",
    symbol: "JitoSOL",
  },
  {
    icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v.png",
    symbol: "USDC",
  },
  {
    icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263.png",
    symbol: "BONK",
  },
];

const TokenInput = () => {
  return (
    <div className="flex flex-col items-center gap-4 border p-4 rounded-lg w-full relative">
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
          <WalletIcon className="w-4 h-4" />
          10.87
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-6 px-2 rounded-sm"
        >
          Half
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-6 px-2 rounded-sm"
        >
          Max
        </Button>
      </div>
      <div className="flex items-center gap-2 w-full">
        <TokenCombobox tokens={tokens} />
        <Input
          placeholder="0"
          className="-translate-y-1.5 text-right bg-transparent pr-1 dark:bg-transparent shadow-none border-none focus:ring-0 focus-visible:ring-0 w-full md:text-xl"
        />
        <span className="absolute bottom-[13px] right-5 text-xs text-muted-foreground">
          $0.00
        </span>
      </div>
    </div>
  );
};

export { TokenInput };
