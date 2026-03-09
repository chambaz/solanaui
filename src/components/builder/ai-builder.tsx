"use client";

import { track } from "@vercel/analytics";
import { TriangleAlertIcon } from "lucide-react";
import React from "react";
import { CodeDisplay } from "@/components/builder/code-display";
import { InstallCommands } from "@/components/builder/install-commands";
import { PreviewPane } from "@/components/builder/preview-pane";
import { PromptInput } from "@/components/builder/prompt-input";
import type { ParsedImports } from "@/lib/builder/parse-imports";
import { parseImports } from "@/lib/builder/parse-imports";
import { cn } from "@/lib/utils";

/**
 * Strips markdown code fences from LLM output.
 * During streaming the closing fence may not exist yet, so we
 * handle partial fences (opening only) as well as complete ones.
 */
function stripFences(code: string): string {
  const trimmed = code.trim();

  // Full fence pair anywhere in the output (LLM may prefix with text)
  const full = trimmed.match(/```(?:tsx?|jsx?|react)?\s*\n([\s\S]*?)```/);
  if (full) return full[1].trim();

  // Opening fence only (still streaming, no closing fence yet)
  const opening = trimmed.match(/```(?:tsx?|jsx?|react)?\s*\n([\s\S]*)$/);
  if (opening) return opening[1];

  return trimmed;
}

interface AIBuilderProps {
  className?: string;
}

const AIBuilder = ({ className }: AIBuilderProps) => {
  const [generatedCode, setGeneratedCode] = React.useState("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [limitReached, setLimitReached] = React.useState(false);
  const [parsedImports, setParsedImports] =
    React.useState<ParsedImports | null>(null);
  const [activeTab, setActiveTab] = React.useState<"code" | "preview">("code");
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleSubmit = async (prompt: string) => {
    track("builder_submit", { prompt: prompt.slice(0, 500) });

    // Reset state
    setHasSubmitted(true);
    setGeneratedCode("");
    setError(null);
    setIsStreaming(true);
    setParsedImports(null);
    setActiveTab("code");

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      if (res.status === 429) {
        track("builder_rate_limited");
        setLimitReached(true);
        setError(
          "You've used all 5 free generations this week. Install SolanaUI components to build your own UI.",
        );
        setIsStreaming(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Please try again.");
        setIsStreaming(false);
        return;
      }

      if (!res.body) {
        setError("No response stream available.");
        setIsStreaming(false);
        return;
      }

      // Read the text stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          setGeneratedCode(stripFences(accumulated));
        }
      } catch (streamErr) {
        // Stream may error mid-read (network issue, abort, etc.)
        if (streamErr instanceof Error && streamErr.name === "AbortError") {
          return;
        }
        console.error("Stream read error:", streamErr);
      }

      // Generation complete
      setIsStreaming(false);

      const cleanCode = stripFences(accumulated);
      if (!cleanCode) {
        setError("No code was generated. Please try again.");
        return;
      }

      // Set final clean code
      setGeneratedCode(cleanCode);

      // Auto-switch to preview tab
      setActiveTab("preview");

      // Parse imports and generate install commands
      const imports = parseImports(cleanCode);
      setParsedImports(imports);

      track("builder_complete", {
        prompt: prompt.slice(0, 500),
        components: imports.solComponents.join(","),
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      console.error("Builder error:", err);
      track("builder_error", { prompt: prompt.slice(0, 500) });
      setError("Failed to connect. Please try again.");
      setIsStreaming(false);
    }
  };

  const showOutput = generatedCode || isStreaming;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="mx-auto w-full max-w-4xl">
        <PromptInput
          onSubmit={handleSubmit}
          isStreaming={isStreaming}
          disabled={limitReached}
        />

        {error && !isStreaming && !generatedCode && (
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-3">
            <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>

      {showOutput && (
        <div className="flex flex-col overflow-hidden rounded-lg border border-border">
          {/* Tab bar */}
          <div className="flex border-b border-border">
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={cn(
                "px-4 py-2 text-xs font-medium transition-colors",
                activeTab === "code"
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Code
            </button>
            <button
              type="button"
              onClick={() => !isStreaming && setActiveTab("preview")}
              disabled={isStreaming}
              className={cn(
                "px-4 py-2 text-xs font-medium transition-colors",
                activeTab === "preview"
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground",
                isStreaming && "opacity-40 cursor-not-allowed",
              )}
            >
              Preview
            </button>
          </div>

          {/* Tab content */}
          <div className="h-[600px]">
            {activeTab === "code" ? (
              <CodeDisplay
                code={generatedCode}
                isStreaming={isStreaming}
                className="h-[600px] rounded-none border-0"
              />
            ) : (
              <PreviewPane
                code={generatedCode || null}
                isLoading={false}
                className="h-[600px] rounded-none border-0"
              />
            )}
          </div>
        </div>
      )}

      {!isStreaming && parsedImports && (
        <InstallCommands imports={parsedImports} />
      )}
    </div>
  );
};

export { AIBuilder };
