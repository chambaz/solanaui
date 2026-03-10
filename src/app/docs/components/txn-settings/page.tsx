"use client";

import React from "react";

import Link from "next/link";



import { TxnSettings, useTxnSettings } from "@/components/sol/txn-settings";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { PropsTable } from "@/components/web/props-table";
import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { Code } from "@/components/web/code";
import { DocsInstallTabs } from "@/components/web/docs-install-tabs";

export default function TokenCardPage() {
  const { settings } = useTxnSettings();
  const [componentSource, setComponentSource] = React.useState("");

  React.useEffect(() => {
    fetch("/generated/component-sources/txn-settings.tsx.txt")
      .then((res) => res.text())
      .then(setComponentSource);
  }, []);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="flex flex-col items-center justify-center gap-4">
          <ul>
            {settings.priority && (
              <li>
                <strong className="text-primary">Transaction priority</strong>:{" "}
                {settings.priority}
              </li>
            )}
            {settings.priorityFeeCap && (
              <li>
                <strong className="text-primary">Priority fee cap</strong>:{" "}
                {settings.priorityFeeCap}
              </li>
            )}
          </ul>
          <TxnSettings />
        </div>
      ),
      code: `import { TxnSettings } from "@/components/sol/txn-settings"

export function TxnSettingsDemo() {
  return (
    <TxnSettings />
  )
}`,
    },
  ];

  return (
    <DocsWrapper>
      <div id="demo">
        <DocsH1 href="/docs/components/txn-settings#demo">TxnSettings</DocsH1>
        <p className="text-muted-foreground">
          The TxnSettings component is a popover that allows users to set the
          transaction priority, fee cap, and other transaction settings.
        </p>
        <DocsTabs variants={variants} />
        <div className="w-full max-w-none" id="installation">
          <DocsH2 href="/docs/components/txn-settings#installation">
            Installation
          </DocsH2>

          <DocsInstallTabs />

          <h3 className="text-lg">
            1. Install shadcn/ui popover, toggle group, input, and button
            components
          </h3>
          <p>
            Use shadcn/ui CLI or manually install the shadcn/ui{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/popover"
              target="_blank"
              rel="noopener noreferrer"
            >
              popover
            </Link>
            ,{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/toggle-group"
              target="_blank"
              rel="noopener noreferrer"
            >
              toggle group
            </Link>
            ,{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/input"
              target="_blank"
              rel="noopener noreferrer"
            >
              input
            </Link>{" "}
            and{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/button"
              target="_blank"
              rel="noopener noreferrer"
            >
              button
            </Link>{" "}
            components.
          </p>
          <Code
            language="shell"
            code={"npx shadcn@latest add popover toggle-group input button"}
          />

          <h3 className="text-lg">2. Install SolanaUI TxnSettings</h3>
          <p>
            Copy the code below to{" "}
            <code>src/components/sol/txn-settings.tsx</code>.
          </p>
          <Code reveal={false} code={componentSource} />

          <h3 className="mb-4 text-lg">
            3. Add TxnSettings provider to your layout
          </h3>
          <Code
            reveal={true}
            code={`import { TxnSettingsProvider } from "@/components/sol/txn-settings";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <TxnSettingsProvider>
        {children}
      </TxnSettingsProvider>
    </div>
  )
}
          `}
          />

          <h3 className="text-lg">4. Use TxnSettings</h3>
          <p>
            Import the <code>TxnSettings</code> component and use it in your
            app.
          </p>
          <Code code={`<TxnSettings />`} />
        </div>
        <div className="!space-y-0" id="props">
          <DocsH2 href="/docs/components/txn-settings#props" className="!mb-0">
            Props
          </DocsH2>
          <PropsTable
            data={[
              {
                name: "trigger",
                type: "React.ReactNode",
                default: `<Button variant="outline" size="icon">
  <IconSettings size={16} />
</Button>`,
              },
            ]}
          />
        </div>
      </div>
    </DocsWrapper>
  );
}
