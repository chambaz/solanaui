import { ImageIcon, LayersIcon, TagIcon, UsersIcon } from "lucide-react";
import { ActivityFeed } from "@/components/sol/activity-feed";
import { NFTCard } from "@/components/sol/nft-card";
import { StatCard } from "@/components/sol/stat-card";
import { WalletSheet } from "@/components/sol/wallet-sheet";

const NFT_IMAGE =
  "https://ybqkchja2noth7nabnjwtcd5wpepkmirgqqptgfupzqk32uwygpa.arweave.net/wGChHSDTXTP9oAtTaYh9s8j1MRE0IPmYtH5greqWwZ4";

const SOL_ICON =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";
const USDC_ICON =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png";
const BONK_ICON =
  "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I";

const NFTS = [
  {
    name: "Mad Lad #4281",
    image: NFT_IMAGE,
    collection: "Mad Lads",
    price: "142.5",
  },
  {
    name: "Mad Lad #1337",
    image: NFT_IMAGE,
    collection: "Mad Lads",
    price: "158.2",
  },
  {
    name: "Mad Lad #7892",
    image: NFT_IMAGE,
    collection: "Mad Lads",
    price: "135.0",
  },
  {
    name: "Mad Lad #2048",
    image: NFT_IMAGE,
    collection: "Mad Lads",
    price: "167.8",
  },
  {
    name: "Mad Lad #512",
    image: NFT_IMAGE,
    collection: "Mad Lads",
    price: "145.3",
  },
  {
    name: "Mad Lad #9001",
    image: NFT_IMAGE,
    collection: "Mad Lads",
    price: "152.7",
  },
  {
    name: "Mad Lad #3456",
    image: NFT_IMAGE,
    collection: "Mad Lads",
    price: "139.9",
  },
  {
    name: "Mad Lad #6174",
    image: NFT_IMAGE,
    collection: "Mad Lads",
    price: "148.1",
  },
  {
    name: "Mad Lad #8523",
    image: NFT_IMAGE,
    collection: "Mad Lads",
    price: "155.4",
  },
  {
    name: "Mad Lad #2901",
    image: NFT_IMAGE,
    collection: "Mad Lads",
    price: "141.2",
  },
  {
    name: "Mad Lad #5678",
    image: NFT_IMAGE,
    collection: "Mad Lads",
    price: "163.9",
  },
  {
    name: "Mad Lad #7401",
    image: NFT_IMAGE,
    collection: "Mad Lads",
    price: "137.6",
  },
];

const RECENT_ACTIVITY = [
  {
    icon: NFT_IMAGE,
    title: "Mad Lad #4281 sold",
    description: "Buyer: 7xKp...3mFn",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    value: "142.5 SOL",
  },
  {
    icon: NFT_IMAGE,
    title: "Mad Lad #1337 listed",
    description: "Seller: 9dVq...8hJr",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    value: "158.2 SOL",
  },
  {
    icon: NFT_IMAGE,
    title: "Mad Lad #7892 sold",
    description: "Buyer: 3kYm...2wBt",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    value: "135.0 SOL",
  },
  {
    icon: NFT_IMAGE,
    title: "Mad Lad #2048 bid placed",
    description: "Bidder: 5nPx...9eLq",
    timestamp: new Date(Date.now() - 22 * 60 * 1000),
    value: "160.0 SOL",
  },
  {
    icon: NFT_IMAGE,
    title: "Mad Lad #512 sold",
    description: "Buyer: 8gRz...4kNs",
    timestamp: new Date(Date.now() - 38 * 60 * 1000),
    value: "145.3 SOL",
  },
  {
    icon: NFT_IMAGE,
    title: "Mad Lad #9001 delisted",
    description: "Owner: 2jCf...7mDw",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
  },
];

const WALLET_TOKENS = [
  {
    icon: SOL_ICON,
    name: "Solana",
    symbol: "SOL",
    balance: "24.58",
    value: "$5,996.73",
    change: "+$248.30",
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
    value: "$994.77",
    change: "-$102.09",
  },
];

export default function MarketplacePage() {
  return (
    <div className="py-8">
      <div className="max-w-[1400px] mx-auto w-full px-4 flex flex-col gap-6">
        {/* Header with auth + wallet */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-semibold">Mad Lads</h1>
            <p className="text-sm text-muted-foreground">
              10,000 generative Mad Lads on the Solana blockchain
            </p>
          </div>
          <WalletSheet
            address="MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA"
            balance="$8,241.50"
            balanceChange="+$146.22"
            balanceChangePercent="+1.81%"
            tokens={WALLET_TOKENS}
          />
        </div>

        {/* Collection stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
