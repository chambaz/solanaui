"use client";

import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import shell from "react-syntax-highlighter/dist/esm/languages/prism/shell-session";
import Dark from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import Light from "react-syntax-highlighter/dist/esm/styles/prism/base16-ateliersulphurpool.light";
import {
  IconCheck,
  IconCopy,
  IconMaximize,
  IconMinimize,
} from "@tabler/icons-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("shell", shell);

type CodeProps = {
  code: string;
  language?: "tsx" | "shell";
  reveal?: boolean;
  className?: string;
  showControls?: boolean;
};

const Code = ({
  code,
  language = "tsx",
  reveal = true,
  showControls = true,
  className,
}: CodeProps) => {
  const { resolvedTheme } = useTheme();
  const [expanded, setExpanded] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Don't render the syntax highlighter until mounted to prevent hydration mismatch
  const syntaxHighlighter = mounted ? (
    <SyntaxHighlighter
      language={language}
      style={resolvedTheme === "dark" ? Dark : Light}
      wrapLines
    >
      {code}
    </SyntaxHighlighter>
  ) : (
    <Skeleton className="mb-2 h-[49px] w-full rounded-md" />
  );

  return (
    <div
      className={cn(
        "relative",
        className,
        !reveal && "h-24 overflow-hidden",
        !reveal && expanded && "h-auto pb-16",
      )}
    >
      {showControls && (
        <CodeControls
          code={code}
          copied={copied}
          reveal={reveal}
          expanded={expanded}
          handleCopy={handleCopy}
          setExpanded={setExpanded}
          className={cn("absolute right-2 top-4 z-30", reveal && "top-2")}
        />
      )}
      <div className="relative">
        {!reveal && (
          <div
            className={cn(
              "absolute left-0 top-0 z-20 h-24 w-full bg-gradient-to-b from-transparent to-background",
              expanded && "hidden",
            )}
          ></div>
        )}
        {syntaxHighlighter}
      </div>
      {!reveal && (
        <Button
          variant="secondary"
          className={cn(
            "absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/4",
            expanded && "bottom-4 top-auto -translate-y-0",
          )}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Collapse" : "Expand"}
        </Button>
      )}
    </div>
  );
};

type CodeControlsProps = {
  code: string;
  copied: boolean;
  reveal: boolean;
  expanded: boolean;
  className?: string;
  handleCopy: () => void;
  setExpanded: (expanded: boolean) => void;
};

const CodeControls = ({
  code,
  copied,
  reveal,
  expanded,
  className,
  handleCopy,
  setExpanded,
}: CodeControlsProps) => {
  return (
    <div className={cn(className)}>
      <CopyToClipboard text={code} onCopy={handleCopy}>
        <Button
          size="icon"
          variant="ghost"
          className={cn("relative", copied && "pointer-events-none")}
        >
          {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
        </Button>
      </CopyToClipboard>
      {!reveal && (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <IconMinimize size={18} /> : <IconMaximize size={18} />}
        </Button>
      )}
    </div>
  );
};

export { Code };
