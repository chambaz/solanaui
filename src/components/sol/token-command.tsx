"use client";

import { ChevronsUpDown } from "lucide-react";
import React from "react";
import { TokenIcon } from "@/components/sol/token-icon";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface TokenCommandToken {
  icon: string;
  symbol: string;
}

interface TokenCommandGroup {
  heading: string;
  tokens: TokenCommandToken[];
}

type TokenCommandProps = {
  onSelect?: (token: TokenCommandToken) => void;
  className?: string;
} & (
  | { tokens: TokenCommandToken[]; groups?: never }
  | { groups: TokenCommandGroup[]; tokens?: never }
);

const TokenCommand = ({
  tokens,
  groups,
  onSelect,
  className,
}: TokenCommandProps) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const allTokens = React.useMemo(() => {
    if (tokens) return tokens;
    if (groups) return groups.flatMap((g) => g.tokens);
    return [];
  }, [tokens, groups]);

  const activeToken = allTokens.find(
    (token) => token.symbol.toLowerCase() === value.toLowerCase(),
  );

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

  const renderItem = (token: TokenCommandToken) => (
    <CommandItem
      key={token.symbol}
      value={token.symbol}
      onSelect={(currentValue) => {
        const newValue = currentValue === value ? "" : currentValue;
        setValue(newValue);
        setOpen(false);
        if (newValue) {
          onSelect?.(token);
        }
      }}
    >
      <TokenIcon src={token.icon} alt={token.symbol} width={20} height={20} />
      {token.symbol}
    </CommandItem>
  );

  return (
    <>
      <Button
        variant="outline"
        className={cn("w-[200px] justify-between", className)}
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
          {groups ? (
            groups.map((group) => (
              <CommandGroup key={group.heading} heading={group.heading}>
                {group.tokens.map(renderItem)}
              </CommandGroup>
            ))
          ) : (
            <CommandGroup heading="Tokens">
              {allTokens.map(renderItem)}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export type { TokenCommandProps, TokenCommandToken, TokenCommandGroup };
export { TokenCommand };
