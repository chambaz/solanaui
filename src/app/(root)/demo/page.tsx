import type { Metadata } from "next";

import { DemoWrapper } from "@/components/web/demo-wrapper";

export const metadata: Metadata = {
  title: "SolanaUI - Demo",
};

export default function DemoPage({
  searchParams,
}: {
  searchParams: { view: string };
}) {
  const view = searchParams.view;

  return <DemoWrapper view={view} />;
}
