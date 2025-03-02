import type { Metadata } from "next";

import { PublicKey } from "@solana/web3.js";

import { Avatar } from "@/components/sol/avatar";

import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { Code } from "@/components/web/code";
import { PropsTable } from "@/components/web/props-table";

export const metadata: Metadata = {
  title: "Avatar - SolanaUI",
};

export default function AvatarPage() {
  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <Avatar
          address={
            new PublicKey("D1bj9NDgFVRxUiKkNyxW9BtYJ1kesQknnqm6xAnk1h8q")
          }
        />
      ),
      code: `import { Avatar } from "@/components/sol/avatar"

export function AvatarDemo() {
  return (
    <Avatar />
  )
}`,
    },
  ];

  return (
    <DocsWrapper>
      <div id="demo">
        <div className="space-y-2">
          <h1 className="text-3xl font-medium">Avatar</h1>
          <p className="text-muted-foreground">
            The Avatar component renders a minidenticon for a given public key.
          </p>
        </div>
        <DocsTabs variants={variants} />
        <div
          className="prose w-full max-w-none pt-8 dark:prose-invert"
          id="installation"
        >
          <h2>Installation</h2>

          <h3 className="text-lg">1. Install Dependencies</h3>
          <p>Avatar requires @solana/web3.js and minidenticons.</p>
          <Code
            language="shell"
            pinnedControls={false}
            code={`npm install @solana/web3.js minidenticons`}
          />

          <h3 className="text-lg">2. Install SolanaUI Avatar</h3>
          <p>
            Copy the code below to <code>src/components/sol/avatar.tsx</code>.
          </p>
          <Code
            reveal={false}
            code={`import React from "react";

import Image from "next/image";

import { PublicKey } from "@solana/web3.js";
import { minidenticon } from "minidenticons";

import { cn } from "@/lib/utils";

type AvatarProps = {
  address: PublicKey;
  size?: number;
  className?: string;
};

const Avatar = ({ address, size = 56, className }: AvatarProps) => {
  const pubkeyStr = address.toBase58();

  const identicon = React.useMemo(() => {
    if (!pubkeyStr) return "";
    return (
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(pubkeyStr, 90, 50))
    );
  }, [pubkeyStr]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full bg-muted p-1 text-muted-foreground",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image src={identicon} alt={pubkeyStr || ""} width={size} height={size} />
    </div>
  );
};

export { Avatar };
`}
          />

          <h3 className="text-lg">4. Use Avatar</h3>
          <p>
            Import the <code>Avatar</code> component and use it in your app.
          </p>
          <Code
            reveal={true}
            code={`<Avatar
  address={
    new PublicKey("D1bj9NDgFVRxUiKkNyxW9BtYJ1kesQknnqm6xAnk1h8q")
  }
/>`}
          />

          <div className="!space-y-0" id="props">
            <h2 className="!mb-0">Props</h2>
            <PropsTable
              data={[
                {
                  name: "address",
                  type: "PublicKey",
                  default: `new PublicKey("D1bj9NDgFVRxUiKkNyxW9BtYJ1kesQknnqm6xAnk1h8q")`,
                },
                {
                  name: "size",
                  type: "number",
                  default: `56`,
                },
                {
                  name: "className",
                  type: "string",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </DocsWrapper>
  );
}
