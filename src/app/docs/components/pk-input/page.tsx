"use client";

import React from "react";
import Link from "next/link";



import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { Code } from "@/components/web/code";
import { DocsInstallTabs } from "@/components/web/docs-install-tabs";

import { PKInput } from "@/components/sol/pk-input";

export default function TokenInputPage() {
  const [componentSource, setComponentSource] = React.useState("");

  React.useEffect(() => {
    fetch("/generated/component-sources/pk-input.tsx.txt")
      .then((res) => res.text())
      .then(setComponentSource);
  }, []);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="w-full max-w-lg">
          <PKInput placeholder="Enter a public key" />
        </div>
      ),
      code: `import { PKInput } from "@/components/sol/pk-input";

export function PKInputDemo() {
  return (
    <PKInput placeholder="Enter a public key" />
  )
}`,
    },
  ];

  return (
    <DocsWrapper>
      <div id="demo">
        <DocsH1 href="/docs/components/pk-input#demo">PKInput</DocsH1>
        <p className="text-muted-foreground">
          The PKInput component is an input field with support for inline public
          key validation.
        </p>
        <DocsTabs variants={variants} />
        <div className="w-full max-w-none" id="installation">
          <DocsH2 href="/docs/components/pk-input#installation">
            Installation
          </DocsH2>

          <DocsInstallTabs />

          <h3 className="text-lg">1. Install shadcn/ui input component</h3>
          <p>
            Use shadcn/ui CLI or manually install the{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/input"
              target="_blank"
              rel="noopener noreferrer"
            >
              input
            </Link>{" "}
            component.
          </p>
          <Code language="shell" code={"npx shadcn@latest add input"} />

          <h3 className="text-lg">2. Install SolanaUI PKInput</h3>
          <p>
            Copy the code below to <code>src/components/sol/pk-input.tsx</code>.
          </p>
          <Code reveal={false} code={componentSource} />

          <h3 className="text-lg">3. Use PKInput</h3>
          <p>
            Import the <code>PKInput</code> component and use it in your app.
          </p>

          <Code reveal={true} code={`<PKInput />`} />
        </div>
      </div>
    </DocsWrapper>
  );
}
