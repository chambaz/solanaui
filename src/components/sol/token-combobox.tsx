"use client";

import * as React from "react";

import Image from "next/image";

import { PublicKey } from "@solana/web3.js";
import { IconSelector, IconCheck } from "@tabler/icons-react";

import { cn, formatUsd, formatNumber } from "@/lib/utils";
import { useAssets, ExtendedDigitalAsset } from "@/hooks/use-assets";

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

type TokenComboboxProps = {
  tokens: PublicKey[];
  owner?: PublicKey;
};

const TokenCombobox = ({ tokens, owner }: TokenComboboxProps) => {
  const { fetchAssets, isLoading } = useAssets();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [assets, setAssets] = React.useState<ExtendedDigitalAsset[]>([]);

  const selectedAsset = React.useMemo(
    () => assets.find((asset) => asset.mint.publicKey === value),
    [assets, value],
  );

  React.useEffect(() => {
    const init = async () => {
      const fetchedAssets = await fetchAssets(tokens, owner);
      console.log(fetchedAssets);
      setAssets(fetchedAssets);
    };
    init();
  }, [fetchAssets, tokens, owner]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-start"
        >
          {selectedAsset ? (
            <>
              {selectedAsset.imageUrl && (
                <Image
                  src={selectedAsset.imageUrl}
                  alt={selectedAsset.metadata.symbol}
                  width={20}
                  height={20}
                  className="mr-2 rounded-full"
                />
              )}
              {selectedAsset.metadata.symbol}
            </>
          ) : (
            "Select token..."
          )}
          <IconSelector className="ml-auto shrink-0 opacity-50" size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search tokens..." />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading..." : "No tokens found."}
            </CommandEmpty>
            <CommandGroup>
              {assets.map((asset) => (
                <CommandItem
                  key={asset.mint.publicKey}
                  value={asset.mint.publicKey}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <IconCheck
                    className={cn(
                      "mr-2",
                      value === asset.mint.publicKey
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                    size={16}
                  />
                  {asset.imageUrl && (
                    <Image
                      src={asset.imageUrl}
                      alt={asset.metadata.symbol}
                      width={20}
                      height={20}
                      className="mr-2 rounded-full"
                    />
                  )}
                  {asset.metadata.symbol}
                  {asset.hasToken && asset.tokenAmount && (
                    <span className="ml-auto flex flex-col text-right">
                      {formatNumber(asset.tokenAmount)}
                      {asset.price && (
                        <span className="text-xs text-muted-foreground">
                          {formatUsd(asset.tokenAmount * asset.price)}
                        </span>
                      )}
                    </span>
                  )}

                  {!asset.hasToken && asset.price && (
                    <span className="ml-auto flex flex-col text-right">
                      {formatUsd(asset.price)}
                    </span>
                  )}
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
