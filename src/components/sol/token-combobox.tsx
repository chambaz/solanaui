"use client";

import React from "react";

import { PublicKey } from "@solana/web3.js";
import { ChevronsUpDownIcon } from "lucide-react";

import { formatUsd, formatNumber } from "@/lib/utils";
import { SearchAssetsArgs, SolAsset } from "@/lib/types";

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
  value?: SolAsset | null;
  onSelect?: (token: SolAsset) => void;
  onSearch?: (args: SearchAssetsArgs) => Promise<SolAsset[]>;
};

const TokenCombobox = ({
  assets: initialAssets,
  trigger,
  address,
  showBalances = true,
  value,
  onSelect,
  onSearch,
}: TokenComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [internalValue, setInternalValue] = React.useState<SolAsset | null>(
    null,
  );
  const [assets, setAssets] = React.useState<SolAsset[]>(initialAssets);
  const searchTimeout = React.useRef<NodeJS.Timeout>();

  // Use value prop if provided (controlled) or internal state if not (uncontrolled)
  const selectedAsset = value !== undefined ? value : internalValue;

  // Memoize the search handler
  const handleSearch = React.useCallback(async () => {
    if (!searchValue) {
      setAssets(initialAssets);
      return;
    }

    if (onSearch && searchValue.length) {
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
  }, [searchValue, initialAssets, onSearch, address]);

  // Memoize filtered assets list rendering
  const renderedAssetsList = React.useMemo(
    () =>
      assets.map((asset) => (
        <CommandItem
          key={asset.mint.toBase58()}
          value={asset.mint.toBase58().toLowerCase()}
          onSelect={() => {
            setOpen(false);
            // Only update internal state if uncontrolled
            if (value === undefined) {
              setInternalValue(asset);
            }
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
      )),
    [assets, value, onSelect, showBalances, setOpen, setInternalValue],
  );

  React.useEffect(() => {
    handleSearch();

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [handleSearch]);

  // Memoize trigger button content
  const triggerContent = React.useMemo(
    () =>
      trigger || (
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
          <ChevronsUpDownIcon size={16} className="ml-auto opacity-50" />
        </Button>
      ),
    [trigger, open, selectedAsset],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerContent}</PopoverTrigger>
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
            <CommandGroup>{renderedAssetsList}</CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { TokenCombobox };
