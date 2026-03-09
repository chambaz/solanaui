import { ImageIcon, LayersIcon, TagIcon, UsersIcon } from "lucide-react";
import { ActivityFeed } from "@/components/sol/activity-feed";
import { NFTCard } from "@/components/sol/nft-card";
import { StatCard } from "@/components/sol/stat-card";
import { WalletSheet } from "@/components/sol/wallet-sheet";

const SOL_ICON =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";
const USDC_ICON =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png";
const BONK_ICON =
  "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I";

const NFTS = [
  {
    name: "SMB #1429",
    image: "https://arweave.net/ttlKMD2c3mVUNGSGcJ5jb9KFyyZgZgjtn9-wcl889a4",
    collection: "SMB Gen2",
    price: "20.8",
  },
  {
    name: "SMB #2840",
    image: "https://arweave.net/D1Bho4qwg9EJSe59oPBMCA5Gno7dUxOqKewBtq0tjYE",
    collection: "SMB Gen2",
    price: "22.1",
  },
  {
    name: "SMB #3054",
    image: "https://arweave.net/yTzVlsafyhZ2sDfwZKwdYDgNQ0nnVR5ybu_FLltRZUY",
    collection: "SMB Gen2",
    price: "19.5",
  },
  {
    name: "SMB #276",
    image: "https://arweave.net/mBxxs2nzRF_l76iXc9_qQJkmWG8jVXKI4tFwNr91oSI",
    collection: "SMB Gen2",
    price: "24.3",
  },
  {
    name: "SMB #4805",
    image: "https://arweave.net/e2JXOcYA-vhOY4e7dNEW7dcRlTnFgrPHf4luwQcOb6I",
    collection: "SMB Gen2",
    price: "21.6",
  },
  {
    name: "SMB #1766",
    image: "https://arweave.net/7dQh_4_sUZnrat7oaIv5MpVRifrnTn1N2nPH7yp0nzI",
    collection: "SMB Gen2",
    price: "23.4",
  },
  {
    name: "SMB #3268",
    image: "https://arweave.net/ePb3-byiEwhiRAFgXraUIw-OLpMG59-HkLLXo1xTJRA",
    collection: "SMB Gen2",
    price: "18.9",
  },
  {
    name: "SMB #805",
    image: "https://arweave.net/WMZV0Fm2y2hxyiyYaoPmpxmF4enQn5IwnSHGeqtx5Zc",
    collection: "SMB Gen2",
    price: "25.7",
  },
  {
    name: "SMB #2058",
    image: "https://arweave.net/A6_moeCwY2FKlV4_FxY5c51ru7BtFI5XiR8srk-WIBc",
    collection: "SMB Gen2",
    price: "20.2",
  },
  {
    name: "SMB #4021",
    image: "https://arweave.net/k9KObJK7xG1toFKFb1DtybjeNtsaOVPpDtRBAgube1M",
    collection: "SMB Gen2",
    price: "22.8",
  },
  {
    name: "SMB #4825",
    image: "https://arweave.net/UwhVkroWwjB3KfNiOnouI57CxT-AqvrBf09kjfRmzUs",
    collection: "SMB Gen2",
    price: "19.1",
  },
  {
    name: "SMB #372",
    image: "https://arweave.net/oHRIY5eYXGO66i5fJ5dzWYvMS1vz1G_lXotIF9PSHa0",
    collection: "SMB Gen2",
    price: "26.4",
  },
];

const RECENT_ACTIVITY = [
  {
    icon: "https://arweave.net/ttlKMD2c3mVUNGSGcJ5jb9KFyyZgZgjtn9-wcl889a4",
    title: "SMB #1429 sold",
    description: "Buyer: 7xKp...3mFn",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    value: "20.8 SOL",
  },
  {
    icon: "https://arweave.net/D1Bho4qwg9EJSe59oPBMCA5Gno7dUxOqKewBtq0tjYE",
    title: "SMB #2840 listed",
    description: "Seller: 9dVq...8hJr",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    value: "22.1 SOL",
  },
  {
    icon: "https://arweave.net/yTzVlsafyhZ2sDfwZKwdYDgNQ0nnVR5ybu_FLltRZUY",
    title: "SMB #3054 sold",
    description: "Buyer: 3kYm...2wBt",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    value: "19.5 SOL",
  },
  {
    icon: "https://arweave.net/mBxxs2nzRF_l76iXc9_qQJkmWG8jVXKI4tFwNr91oSI",
    title: "SMB #276 bid placed",
    description: "Bidder: 5nPx...9eLq",
    timestamp: new Date(Date.now() - 22 * 60 * 1000),
    value: "23.0 SOL",
  },
  {
    icon: "https://arweave.net/e2JXOcYA-vhOY4e7dNEW7dcRlTnFgrPHf4luwQcOb6I",
    title: "SMB #4805 sold",
    description: "Buyer: 8gRz...4kNs",
    timestamp: new Date(Date.now() - 38 * 60 * 1000),
    value: "21.6 SOL",
  },
  {
    icon: "https://arweave.net/7dQh_4_sUZnrat7oaIv5MpVRifrnTn1N2nPH7yp0nzI",
    title: "SMB #1766 delisted",
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
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Solana Monkey Business
            </h1>
            <p className="text-sm text-muted-foreground">
              5,000 unique pixel monkeys on the Solana blockchain
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
            value="18.9 SOL"
            change="+8.2%"
            icon={<TagIcon className="size-4" />}
          />
          <StatCard
            label="Total Volume"
            value="842K SOL"
            change="+3.1%"
            icon={<LayersIcon className="size-4" />}
          />
          <StatCard
            label="Listed"
            value="218"
            change="-1.4%"
            trend="down"
            icon={<ImageIcon className="size-4" />}
          />
          <StatCard
            label="Owners"
            value="3,412"
            change="+0.9%"
            icon={<UsersIcon className="size-4" />}
          />
        </div>

        {/* NFT grid */}
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
