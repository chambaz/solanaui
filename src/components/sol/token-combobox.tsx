"use client";

import React from "react";

import { PublicKey } from "@solana/web3.js";
import { ChevronsUpDownIcon } from "lucide-react";

import { formatUsd, formatNumber } from "@/lib/utils";
import { SolAsset } from "@/lib/types";

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
  assets: SolAsset[];
  trigger?: React.ReactNode;
  address?: PublicKey | null;
  showBalances?: boolean;
  onSelect?: (token: SolAsset) => void;
  onSearch?: ({
    query,
    owner,
  }: {
    query: string;
    owner?: PublicKey;
  }) => Promise<SolAsset[]>;
};

const TokenCombobox = ({
  assets: initialAssets,
  trigger,
  address,
  showBalances = true,
  onSelect,
  onSearch,
}: TokenComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");
  const [assets, setAssets] = React.useState<SolAsset[]>(initialAssets);
  const searchTimeout = React.useRef<NodeJS.Timeout>();

  const selectedAsset = React.useMemo(
    () => assets.find((asset) => asset.mint.toBase58().toLowerCase() === value),
    [assets, value],
  );

  React.useEffect(() => {
    const handleSearch = async () => {
      if (!searchValue) {
        setAssets(initialAssets);
        return;
      }

      if (onSearch) {
        if (searchTimeout.current) {
          clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(async () => {
          const searchResults = await onSearch({
            query: searchValue,
            owner: address ?? undefined,
          });
          setAssets(searchResults);
        }, 300);
      } else {
        const filtered = initialAssets.filter((asset) =>
          asset.symbol.toLowerCase().includes(searchValue.toLowerCase()),
        );
        setAssets(filtered);
      }
    };

    handleSearch();

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchValue, initialAssets, onSearch, address]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            role="combobox"
            size="lg"
            aria-expanded={open}
            className="h-12 w-[300px] justify-start gap-2.5 px-3 font-medium"
          >
            {selectedAsset ? (
              <>
                <TokenIcon asset={selectedAsset} />
                {selectedAsset.symbol}
              </>
            ) : (
              "Select token..."
            )}
            <ChevronsUpDownIcon size={16} className="opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search tokens..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {assets.length === 0 && (
              <CommandEmpty>
                {searchValue ? "No tokens found." : "Loading..."}
              </CommandEmpty>
            )}
            <CommandGroup>
              {assets.map((asset) => (
                <CommandItem
                  key={asset.mint.toBase58()}
                  value={asset.mint.toBase58().toLowerCase()}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    if (onSelect) onSelect(asset);
                  }}
                  className="flex items-center gap-2"
                >
                  <TokenIcon asset={asset} />
                  {asset.symbol}

                  <span className="ml-auto flex flex-col text-right">
                    {!showBalances ? (
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
