import type { Metadata } from "next";

import path from "path";
import { promises as fs } from "fs";
import { PublicKey } from "@solana/web3.js";

import { Avatar } from "@/components/sol/avatar";

import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { Code } from "@/components/web/code";
import { PropsTable } from "@/components/web/props-table";

export const metadata: Metadata = {
  title: "Avatar - SolanaUI",
};

export default async function AvatarPage() {
  const componentSource = await fs.readFile(
    path.join(process.cwd(), "src/components/sol/avatar.tsx"),
    "utf8",
  );

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
    <Avatar address={PublicKey.default} />
  )
}`,
    },
  ];

  return (
    <DocsWrapper>
      <div id="demo">
        <DocsH1 href="/docs/components/avatar#demo">Avatar</DocsH1>
        <p className="text-muted-foreground">
          The Avatar component renders a minidenticon for a given public key.
        </p>
        <DocsTabs variants={variants} />
        <div className="w-full max-w-none" id="installation">
          <DocsH2 href="/docs/components/avatar#installation">
            Installation
          </DocsH2>

          <h3 className="text-lg">1. Install Dependencies</h3>
          <p>Avatar requires minidenticons.</p>
          <Code language="shell" code={`npm install minidenticons`} />

          <h3 className="text-lg">2. Install SolanaUI Avatar</h3>
          <p>
            Copy the code below to <code>src/components/sol/avatar.tsx</code>.
          </p>
          <Code reveal={false} code={componentSource} />

          <h3 className="text-lg">4. Use Avatar</h3>
          <p>
            Import the <code>Avatar</code> component and use it in your app.
          </p>
          <Code reveal={true} code={`<Avatar address={PublicKey.default} />`} />

          <div className="!space-y-0" id="props">
            <DocsH2 href="/docs/components/avatar#props" className="!mb-0">
              Props
            </DocsH2>
            <PropsTable
              data={[
                {
                  name: "address",
                  type: "PublicKey",
                },
                {
                  name: "size",
                  type: "number",
                  default: `48`,
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
