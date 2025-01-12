"use client";

import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import ColdDark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";
import {
  IconCheck,
  IconCopy,
  IconMaximize,
  IconMinimize,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("bash", bash);

type CodeProps = {
  code: string;
  language?: "jsx" | "bash";
  reveal?: boolean;
  pinnedControls?: boolean;
};

const Code = ({
  code,
  language = "jsx",
  reveal = true,
  pinnedControls = true,
}: CodeProps) => {
  const [expanded, setExpanded] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "relative",
        !pinnedControls && "pt-2",
        !reveal && "h-24 overflow-hidden",
        !reveal && expanded && "h-auto pb-16",
      )}
    >
      <CodeControls
        code={code}
        copied={copied}
        reveal={reveal}
        expanded={expanded}
        handleCopy={handleCopy}
        setExpanded={setExpanded}
        className={cn(
          "absolute right-4 top-4 z-30",
          !pinnedControls && "-top-7 right-0",
        )}
      />
      <div className="relative">
        {!reveal && (
          <div
            className={cn(
              "absolute left-0 top-0 z-20 h-24 w-full bg-gradient-to-b from-transparent to-background",
              expanded && "hidden",
            )}
          ></div>
        )}
        <SyntaxHighlighter language={language} style={ColdDark} wrapLines>
          {code}
        </SyntaxHighlighter>
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
