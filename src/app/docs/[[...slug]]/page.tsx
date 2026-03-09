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
import { Button } from "@/components/ui/button";
import { getPageImage, source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { ActionBox } from "@/registry/sol/action-box";
import { ActivityFeed } from "@/registry/sol/activity-feed";
import { AddressDisplay } from "@/registry/sol/address-display";
import { AuthCard } from "@/registry/sol/auth-card";
import { HealthBar } from "@/registry/sol/health-bar";
import { LeverageSlider } from "@/registry/sol/leverage-slider";
import { NFTCard } from "@/registry/sol/nft-card";
import { OrderBook } from "@/registry/sol/order-book";
import { OrderForm } from "@/registry/sol/order-form";
import { PoolCard } from "@/registry/sol/pool-card";
import { PoolTable } from "@/registry/sol/pool-table";
import { PositionCard } from "@/registry/sol/position-card";
import { PositionTable } from "@/registry/sol/position-table";
import { PriceChart } from "@/registry/sol/price-chart";
import { SparklineChart } from "@/registry/sol/sparkline-chart";
import { StatCard } from "@/registry/sol/stat-card";
import { SwapBox } from "@/registry/sol/swap-box";
import { TokenCombobox } from "@/registry/sol/token-combobox";
import { TokenCommand } from "@/registry/sol/token-command";
import { TokenIcon } from "@/registry/sol/token-icon";
import { TokenIconGroup } from "@/registry/sol/token-icon-group";
import { TokenInput } from "@/registry/sol/token-input";
import { TradeBox } from "@/registry/sol/trade-box";
import { TradeButtons } from "@/registry/sol/trade-buttons";
import { TradeChart } from "@/registry/sol/trade-chart";
import { TrendBadge } from "@/registry/sol/trend-badge";
import { TxnTable } from "@/registry/sol/txn-table";
import { WalletSheet } from "@/registry/sol/wallet-sheet";

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
