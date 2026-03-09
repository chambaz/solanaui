import { createRelativeLink } from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TxnToastDemo } from "@/components/docs/txn-toast-demo";
import { ActionBox } from "@/components/sol/action-box";
import { ActivityFeed } from "@/components/sol/activity-feed";
import { AddressDisplay } from "@/components/sol/address-display";
import { AuthCard } from "@/components/sol/auth-card";
import { HealthBar } from "@/components/sol/health-bar";
import { LeverageSlider } from "@/components/sol/leverage-slider";
import { NFTCard } from "@/components/sol/nft-card";
import { OrderBook } from "@/components/sol/order-book";
import { OrderForm } from "@/components/sol/order-form";
import { PoolCard } from "@/components/sol/pool-card";
import { PoolTable } from "@/components/sol/pool-table";
import { PositionCard } from "@/components/sol/position-card";
import { PositionTable } from "@/components/sol/position-table";
import { PriceChart } from "@/components/sol/price-chart";
import { SparklineChart } from "@/components/sol/sparkline-chart";
import { StatCard } from "@/components/sol/stat-card";
import { SwapBox } from "@/components/sol/swap-box";
import { TokenCombobox } from "@/components/sol/token-combobox";
import { TokenCommand } from "@/components/sol/token-command";
import { TokenIcon } from "@/components/sol/token-icon";
import { TokenIconGroup } from "@/components/sol/token-icon-group";
import { TokenInput } from "@/components/sol/token-input";
import { TradeBox } from "@/components/sol/trade-box";
import { TradeButtons } from "@/components/sol/trade-buttons";
import { TradeChart } from "@/components/sol/trade-chart";
import { TrendBadge } from "@/components/sol/trend-badge";
import { TxnTable } from "@/components/sol/txn-table";
import { WalletSheet } from "@/components/sol/wallet-sheet";
import { Button } from "@/components/ui/button";
import { getPageImage, source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
            ActionBox,
            ActivityFeed,
            AddressDisplay,
            AuthCard,
            Button,
            HealthBar,
            LeverageSlider,
            NFTCard,
            OrderBook,
            OrderForm,
            PoolCard,
            PoolTable,
            PositionCard,
            PositionTable,
            PriceChart,
            SparklineChart,
            StatCard,
            SwapBox,
            TokenCombobox,
            TokenCommand,
            TokenIcon,
            TokenIconGroup,
            TokenInput,
            TradeBox,
            TradeButtons,
            TradeChart,
            TrendBadge,
            TxnTable,
            TxnToastDemo,
            WalletSheet,
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
