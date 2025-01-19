"use client";

import * as React from "react";

import { PublicKey } from "@solana/web3.js";
import { IconSelector } from "@tabler/icons-react";

import { formatUsd, formatNumber } from "@/lib/utils";
import { useAssets, SolAsset } from "@/hooks/use-assets";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { TokenIcon } from "@/components/sol/token-icon";

type TokenComboboxProps = {
  tokens: PublicKey[];
  owner?: PublicKey | null;
  onSelect?: (token: SolAsset) => void;
  children?: React.ReactNode;
};

const TokenCombobox = ({
  tokens,
  owner,
  onSelect,
  children,
}: TokenComboboxProps) => {
  const { fetchAssets, isLoading } = useAssets();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [assets, setAssets] = React.useState<SolAsset[]>([]);

  const selectedAsset = React.useMemo(
    () => assets.find((asset) => asset.symbol === value),
    [assets, value],
  );

  React.useEffect(() => {
    if (assets.length) return;

    const init = async () => {
      const fetchedAssets = await fetchAssets(tokens, owner ?? undefined);
      const sortedAssets = fetchedAssets.sort((a, b) => {
        const aAmount = a.price ? a.price : 0;
        const bAmount = b.price ? b.price : 0;
        return bAmount - aAmount;
      });
      setAssets(sortedAssets);
    };
    init();
  }, [fetchAssets, assets, tokens, owner]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button
            variant="outline"
            role="combobox"
            size="lg"
            aria-expanded={open}
            className="h-12 w-[300px] justify-start gap-2.5 px-3 font-medium"
          >
            {selectedAsset ? (
              <>
                <TokenIcon
                  token={selectedAsset.mint}
                  image={selectedAsset.image}
                />
                {selectedAsset.symbol}
              </>
            ) : (
              "Select token..."
            )}
            <IconSelector className="ml-auto shrink-0 opacity-50" size={16} />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search tokens..." />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading..." : "No tokens found."}
            </CommandEmpty>
            <CommandGroup>
              {assets.map((asset) => (
                <CommandItem
                  key={asset.mint.toBase58()}
                  value={asset.symbol}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    if (onSelect) onSelect(asset);
                  }}
                  className="flex items-center gap-2"
                >
                  <TokenIcon token={asset.mint} image={asset.image} />
                  {asset.symbol}

                  <span className="ml-auto flex flex-col text-right">
                    {!owner ? (
                      formatUsd(asset.price ?? 0)
                    ) : (
                      <>
                        {asset.userTokenAccount &&
                        asset.userTokenAccount.amount &&
                        asset.userTokenAccount.amount > 0
                          ? formatNumber(asset.userTokenAccount.amount)
                          : 0}

                        {asset.price && (
                          <span className="text-xs text-muted-foreground">
                            {formatUsd(
                              ((asset.userTokenAccount &&
                                asset.userTokenAccount.amount) ||
                                1) * asset.price,
                            )}
                          </span>
                        )}
                      </>
                    )}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { TokenCombobox };
