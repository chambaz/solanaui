import { ImageIcon, LayersIcon, TagIcon, UsersIcon } from "lucide-react";
import { ActivityFeed } from "@/components/sol/activity-feed";
import { NFTCard } from "@/components/sol/nft-card";
import { StatCard } from "@/components/sol/stat-card";
import { WalletSheet } from "@/components/sol/wallet-sheet";

const MAD_LADS_BASE = "https://madlads.s3.us-west-2.amazonaws.com";

const SOL_ICON =
  "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png";
const USDC_ICON =
  "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v.png";
const BONK_ICON =
  "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263.png";

const NFTS = [
  {
    name: "Mad Lad #4281",
    image: `${MAD_LADS_BASE}/4281.png`,
    collection: "Mad Lads",
    price: "142.5",
  },
  {
    name: "Mad Lad #1337",
    image: `${MAD_LADS_BASE}/1337.png`,
    collection: "Mad Lads",
    price: "158.2",
  },
  {
    name: "Mad Lad #7892",
    image: `${MAD_LADS_BASE}/7892.png`,
    collection: "Mad Lads",
    price: "135.0",
  },
  {
    name: "Mad Lad #2048",
    image: `${MAD_LADS_BASE}/2048.png`,
    collection: "Mad Lads",
    price: "167.8",
  },
  {
    name: "Mad Lad #512",
    image: `${MAD_LADS_BASE}/512.png`,
    collection: "Mad Lads",
    price: "145.3",
  },
  {
    name: "Mad Lad #9001",
    image: `${MAD_LADS_BASE}/9001.png`,
    collection: "Mad Lads",
    price: "152.7",
  },
  {
    name: "Mad Lad #3456",
    image: `${MAD_LADS_BASE}/3456.png`,
    collection: "Mad Lads",
    price: "139.9",
  },
  {
    name: "Mad Lad #6174",
    image: `${MAD_LADS_BASE}/6174.png`,
    collection: "Mad Lads",
    price: "148.1",
  },
  {
    name: "Mad Lad #8523",
    image: `${MAD_LADS_BASE}/8523.png`,
    collection: "Mad Lads",
    price: "155.4",
  },
  {
    name: "Mad Lad #2901",
    image: `${MAD_LADS_BASE}/2901.png`,
    collection: "Mad Lads",
    price: "141.2",
  },
  {
    name: "Mad Lad #5678",
    image: `${MAD_LADS_BASE}/5678.png`,
    collection: "Mad Lads",
    price: "163.9",
  },
  {
    name: "Mad Lad #7401",
    image: `${MAD_LADS_BASE}/7401.png`,
    collection: "Mad Lads",
    price: "137.6",
  },
];

const RECENT_ACTIVITY = [
  {
    icon: `${MAD_LADS_BASE}/4281.png`,
    title: "Mad Lad #4281 sold",
    description: "Buyer: 7xKp...3mFn",
    time: "2m ago",
    value: "142.5 SOL",
  },
  {
    icon: `${MAD_LADS_BASE}/1337.png`,
    title: "Mad Lad #1337 listed",
    description: "Seller: 9dVq...8hJr",
    time: "8m ago",
    value: "158.2 SOL",
  },
  {
    icon: `${MAD_LADS_BASE}/7892.png`,
    title: "Mad Lad #7892 sold",
    description: "Buyer: 3kYm...2wBt",
    time: "15m ago",
    value: "135.0 SOL",
  },
  {
    icon: `${MAD_LADS_BASE}/2048.png`,
    title: "Mad Lad #2048 bid placed",
    description: "Bidder: 5nPx...9eLq",
    time: "22m ago",
    value: "160.0 SOL",
  },
  {
    icon: `${MAD_LADS_BASE}/512.png`,
    title: "Mad Lad #512 sold",
    description: "Buyer: 8gRz...4kNs",
    time: "38m ago",
    value: "145.3 SOL",
  },
  {
    icon: `${MAD_LADS_BASE}/9001.png`,
    title: "Mad Lad #9001 delisted",
    description: "Owner: 2jCf...7mDw",
    time: "1h ago",
  },
];

const WALLET_TOKENS = [
  {
    icon: SOL_ICON,
    name: "Solana",
    symbol: "SOL",
    balance: "24.58",
    value: "$3,995.72",
    change: "-$12.40",
  },
  {
    icon: USDC_ICON,
    name: "USD Coin",
    symbol: "USDC",
    balance: "1,250.00",
    value: "$1,250.00",
    change: "+$0.01",
  },
  {
    icon: BONK_ICON,
    name: "Bonk",
    symbol: "BONK",
    balance: "15,420,000",
    value: "$438.03",
    change: "-$8.21",
  },
];

export default function MarketplacePage() {
  return (
    <div className="py-8">
      <div className="max-w-[1400px] mx-auto w-full px-4 flex flex-col gap-6">
        {/* Header with auth + wallet */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold">Mad Lads</h1>
            <p className="text-sm text-muted-foreground">
              10,000 generative Mad Lads on the Solana blockchain
            </p>
          </div>
          <WalletSheet
            address="7xKpR4nm3kW9vBzL5hQd2mFnZq8gT4pYx9eRwVb3mKs"
            balance="$5,683.75"
            balanceChange="-$20.60"
            balanceChangePercent="-0.36%"
            tokens={WALLET_TOKENS}
          />
        </div>

        {/* Collection stats */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            label="Floor Price"
            value="135.0 SOL"
            change="+12.5%"
            icon={<TagIcon className="size-4" />}
          />
          <StatCard
            label="Total Volume"
            value="1.2M SOL"
            change="+4.8%"
            icon={<LayersIcon className="size-4" />}
          />
          <StatCard
            label="Listed"
            value="342"
            change="-2.1%"
            trend="down"
            icon={<ImageIcon className="size-4" />}
          />
          <StatCard
            label="Owners"
            value="4,891"
            change="+1.3%"
            icon={<UsersIcon className="size-4" />}
          />
        </div>

        {/* NFT grid - 5 columns, full width */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {NFTS.map((nft) => (
            <NFTCard key={nft.name} {...nft} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <ActivityFeed items={RECENT_ACTIVITY} />
        </div>
      </div>
    </div>
  );
}
