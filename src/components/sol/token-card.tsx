"use client";

import React from "react";

import Link from "next/link";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { IconExternalLink } from "@tabler/icons-react";

import { formatUsd, shortAddress } from "@/lib/utils";
import { ExtendedDigitalAsset, useAssets } from "@/hooks/use-assets";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { TokenIcon } from "@/components/sol/token-icon";
import { Sparkline } from "@/components/sol/sparkline";

type TokenCardProps = {
  address: PublicKey;
};

const chartData = [
  {
    timestamp: 1729497600,
    price: 166.22575388822187,
  },
  {
    timestamp: 1729512000,
    price: 165.1973752338582,
  },
  {
    timestamp: 1729526400,
    price: 167.72628329940926,
  },
  {
    timestamp: 1729540800,
    price: 166.1457184770941,
  },
  {
    timestamp: 1729555200,
    price: 166.30672676443785,
  },
  {
    timestamp: 1729569600,
    price: 166.99040400200792,
  },
  {
    timestamp: 1729584000,
    price: 167.74924961064926,
  },
  {
    timestamp: 1729598400,
    price: 167.67951900557327,
  },
  {
    timestamp: 1729612800,
    price: 168.393126214661,
  },
  {
    timestamp: 1729627200,
    price: 167.5040003649191,
  },
  {
    timestamp: 1729641600,
    price: 165.3643818819566,
  },
  {
    timestamp: 1729656000,
    price: 165.59091016828737,
  },
  {
    timestamp: 1729670400,
    price: 166.25288067867825,
  },
  {
    timestamp: 1729684800,
    price: 167.9115192920274,
  },
  {
    timestamp: 1729699200,
    price: 172.76565749760547,
  },
  {
    timestamp: 1729713600,
    price: 170.67546335109927,
  },
  {
    timestamp: 1729728000,
    price: 173.99094032598717,
  },
  {
    timestamp: 1729742400,
    price: 173.35325197132033,
  },
  {
    timestamp: 1729756800,
    price: 173.75740450830745,
  },
  {
    timestamp: 1729771200,
    price: 175.31664351476886,
  },
  {
    timestamp: 1729785600,
    price: 177.29299560109726,
  },
  {
    timestamp: 1729800000,
    price: 176.79803579372185,
  },
  {
    timestamp: 1729814400,
    price: 174.54929972534532,
  },
  {
    timestamp: 1729828800,
    price: 171.79983719096626,
  },
  {
    timestamp: 1729843200,
    price: 173.59774415305043,
  },
  {
    timestamp: 1729857600,
    price: 172.3679345827452,
  },
  {
    timestamp: 1729872000,
    price: 167.72429952799243,
  },
  {
    timestamp: 1729886400,
    price: 164.62124921921972,
  },
  {
    timestamp: 1729900800,
    price: 165.37663903871496,
  },
  {
    timestamp: 1729915200,
    price: 167.20540619201378,
  },
  {
    timestamp: 1729929600,
    price: 168.4693512748888,
  },
  {
    timestamp: 1729944000,
    price: 168.40104936663124,
  },
  {
    timestamp: 1729958400,
    price: 171.2865458664458,
  },
  {
    timestamp: 1729972800,
    price: 170.61494195147168,
  },
  {
    timestamp: 1729987200,
    price: 171.8256145047652,
  },
  {
    timestamp: 1730001600,
    price: 173.02192434335294,
  },
  {
    timestamp: 1730016000,
    price: 173.85071018289005,
  },
  {
    timestamp: 1730030400,
    price: 175.68474708930273,
  },
  {
    timestamp: 1730044800,
    price: 176.97165107365552,
  },
  {
    timestamp: 1730059200,
    price: 176.46072461553408,
  },
  {
    timestamp: 1730073600,
    price: 170.63359213387736,
  },
];

const TokenCard = ({ address }: TokenCardProps) => {
  const { fetchAssets, isLoading } = useAssets();
  const { publicKey } = useWallet();
  const [asset, setAsset] = React.useState<ExtendedDigitalAsset | null>(null);

  React.useEffect(() => {
    const fetchAsset = async () => {
      try {
        const assets = await fetchAssets([address], publicKey ?? undefined);
        setAsset(assets[0] || null);
      } catch (error) {
        console.error("Error fetching asset:", error);
      }
    };

    fetchAsset();
  }, [address, publicKey, fetchAssets]);

  if (isLoading) {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="sr-only">Loading...</span>
            <Skeleton className="h-[48px] w-[48px] shrink-0 rounded-full" />
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-[12px] w-4/5" />
              <Skeleton className="h-[12px] w-4/5" />
            </div>
          </CardTitle>
          <CardDescription className="sr-only">Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[116px] w-[300px]" />
        </CardContent>
      </Card>
    );
  }

  if (!asset) return null;

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TokenIcon token={asset.metadata.symbol} size={48} />
          <div className="flex flex-col">
            {asset.metadata.name}
            <Link
              href={`https://solscan.io/token/${asset.publicKey.toString()}`}
              className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground"
            >
              <IconExternalLink size={12} />
              {shortAddress(asset.publicKey)}
            </Link>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-0">
        {asset.price && <p className="text-4xl">{formatUsd(asset.price)}</p>}
        <Sparkline data={chartData} />
      </CardContent>
    </Card>
  );
};

export { TokenCard };
