"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import React from "react";
import type { Highlighter } from "shiki";
import { createHighlighter } from "shiki";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Lazy singleton shiki highlighter. Created once on first use,
 * then cached for all subsequent highlights.
 */
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: ["tsx"],
    });
  }
  return highlighterPromise;
}

/**
 * Highlight a code string with shiki dual-theme mode.
 * Returns HTML with CSS variables for both light and dark themes.
 */
async function highlightCode(code: string): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang: "tsx",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}

/** Throttle interval for highlighting during streaming (ms) */
const HIGHLIGHT_THROTTLE_MS = 300;

/**
 * CSS for shiki dual-theme support. The highlighted HTML uses
 * --shiki-light and --shiki-dark CSS variables on each span.
 * We select the correct one based on the .dark class on <html>.
 */
const SHIKI_THEME_CSS = `
  .shiki { background-color: transparent !important; }
  .shiki code { background-color: transparent !important; }
  .shiki span { color: var(--shiki-light); }
  html.dark .shiki span { color: var(--shiki-dark); }
`;

interface CodeDisplayProps {
  code: string;
  isStreaming: boolean;
  className?: string;
}

const CodeDisplay = ({ code, isStreaming, className }: CodeDisplayProps) => {
  const [copied, setCopied] = React.useState(false);
  const [highlightedHtml, setHighlightedHtml] = React.useState<string | null>(
    null,
  );
  const preRef = React.useRef<HTMLElement>(null);
  const lastHighlightTimeRef = React.useRef(0);
  const pendingTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const prevCodeLengthRef = React.useRef(0);

  // Highlight code with throttling during streaming, immediate on completion
  React.useEffect(() => {
    if (!code) {
      setHighlightedHtml(null);
      return;
    }

    let cancelled = false;

    const doHighlight = () => {
      highlightCode(code).then((html) => {
        if (!cancelled) {
          setHighlightedHtml(html);
          lastHighlightTimeRef.current = Date.now();
        }
      });
    };

    if (!isStreaming) {
      // Stream ended: final highlight immediately
      doHighlight();
      // Clear any pending throttled highlight
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
    } else {
      // Streaming: throttle highlights
      const elapsed = Date.now() - lastHighlightTimeRef.current;
      if (elapsed >= HIGHLIGHT_THROTTLE_MS) {
        doHighlight();
      } else if (!pendingTimerRef.current) {
        // Schedule a highlight for when the throttle window expires
        pendingTimerRef.current = setTimeout(() => {
          pendingTimerRef.current = null;
          if (!cancelled) {
            doHighlight();
          }
        }, HIGHLIGHT_THROTTLE_MS - elapsed);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [code, isStreaming]);

  // Auto-scroll during streaming
  React.useEffect(() => {
    if (
      isStreaming &&
      preRef.current &&
      code.length > prevCodeLengthRef.current
    ) {
      // Use rAF to ensure DOM has updated (especially after innerHTML swap)
      requestAnimationFrame(() => {
        if (preRef.current) {
          preRef.current.scrollTop = preRef.current.scrollHeight;
        }
      });
    }
    prevCodeLengthRef.current = code.length;
  }, [code, isStreaming]);

  // Clean up pending timer on unmount
  React.useEffect(() => {
    return () => {
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may not be available
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden bg-muted/30",
        className,
      )}
    >
      <style>{SHIKI_THEME_CSS}</style>

      {/* Copy button floats top-right */}
      {code && !isStreaming && (
        <div className="absolute top-2 right-3 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-7 w-7"
          >
            {copied ? (
              <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <CopyIcon className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      )}

      {highlightedHtml ? (
        <div
          ref={preRef as React.RefObject<HTMLDivElement>}
          className="flex-1 overflow-auto text-xs leading-relaxed [&_pre]:p-4 [&_code]:text-xs [&_code]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre
          ref={preRef as React.RefObject<HTMLPreElement>}
          className="flex-1 overflow-auto p-4 text-xs leading-relaxed"
        >
          <code className="text-foreground/90">
            {code || (
              <span className="text-muted-foreground">
                {"// Your generated code will appear here..."}
              </span>
            )}
          </code>
        </pre>
      )}

      {isStreaming && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/30 to-transparent" />
      )}
    </div>
  );
};

export { CodeDisplay };
