"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { TokenIcon } from "@/components/sol/token-icon";

type TokenCommandProps = {
  tokens: {
    icon: string;
    symbol: string;
  }[];
};

const TokenCommand = ({ tokens }: TokenCommandProps) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const activeToken = tokens.find((token) => token.symbol === value);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="w-[200px] justify-between"
        onClick={() => setOpen(true)}
      >
        {activeToken ? (
          <div className="flex items-center gap-2.5">
            <TokenIcon
              src={activeToken.icon}
              alt={activeToken.symbol}
              width={20}
              height={20}
            />
            {activeToken.symbol}
          </div>
        ) : (
          "Select token..."
        )}
        <ChevronsUpDown className="opacity-50" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search token..." />
        <CommandList>
          <CommandEmpty>No tokens found.</CommandEmpty>
          <CommandGroup heading="Tokens">
            {tokens.map((token) => (
              <CommandItem
                key={token.symbol}
                value={token.symbol}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <TokenIcon
                  src={token.icon}
                  alt={token.symbol}
                  width={20}
                  height={20}
                />
                {token.symbol}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export type { TokenCommandProps };
export { TokenCommand };
