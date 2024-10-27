"use client";

import { TokenIcon } from "@/components/sol/token-icon";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function TokenIconPage() {
  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="flex flex-row gap-4">
          <TokenIcon token="SOL" size={48} />
          <TokenIcon token="USDC" size={48} />
          <TokenIcon token="$WIF" size={48} />
          <TokenIcon token="BONK" size={48} />
        </div>
      ),
      code: `import { TokenIcon } from "@/components/sol/token-icon"

export function TokenIconDemo() {
  return (
    <TokenIcon token="SOL" size={48} />
    <TokenIcon token="USDC" size={48} />
    <TokenIcon token="$WIF" size={48} />
    <TokenIcon token="BONK" size={48} />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
