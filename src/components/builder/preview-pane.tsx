"use client";

import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { Loader2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { PREVIEW_FILES } from "@/lib/builder/preview-files";
import { cn } from "@/lib/utils";

/**
 * Token icon URL mapping. The LLM generates short paths like "/sol.png"
 * which we rewrite to real CDN URLs for the Sandpack preview.
 */
const TOKEN_ICON_URLS: Record<string, string> = {
  "/sol.png":
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  "/usdc.png":
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  "/bonk.png":
    "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
  "/jitosol.png":
    "https://storage.googleapis.com/token-metadata/JitoSOL-256.png",
  "/msol.png":
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
  "/nft.png":
    "https://ybqkchja2noth7nabnjwtcd5wpepkmirgqqptgfupzqk32uwygpa.arweave.net/wGChHSDTXTP9oAtTaYh9s8j1MRE0IPmYtH5greqWwZ4",
};

/**
 * Rewrite @/ import aliases to / so Sandpack can resolve them
 * from the virtual file system. Strip "use client" directives.
 * Replace token icon paths with real CDN URLs.
 */
function transformForSandpack(code: string): string {
  let result = code
    .replace(/["']use client["'];?\s*\n?/g, "")
    .replace(/from\s+["']@\//g, 'from "/')
    .replace(/import\s+["']@\//g, 'import "/');

  // Replace token icon paths with CDN URLs
  for (const [path, url] of Object.entries(TOKEN_ICON_URLS)) {
    result = result.replaceAll(`"${path}"`, `"${url}"`);
    result = result.replaceAll(`'${path}'`, `'${url}'`);
  }

  return result;
}

/**
 * Dependencies needed by the components in the Sandpack sandbox.
 * Versions are pinned to match the project's package.json.
 */
const SANDBOX_DEPENDENCIES: Record<string, string> = {
  "class-variance-authority": "^0.7.1",
  clsx: "^2.1.1",
  cmdk: "^1.1.1",
  "lucide-react": "^0.546.0",
  recharts: "2.15.4",
  "tailwind-merge": "^3.3.1",
  "lightweight-charts": "^5.0.9",
  "radix-ui": "^1.4.3",
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-popover": "^1.1.14",
  "@radix-ui/react-separator": "^1.1.7",
  "@radix-ui/react-slider": "^1.3.5",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-toggle": "^1.1.9",
  "@radix-ui/react-toggle-group": "^1.1.10",
  "@radix-ui/react-collapsible": "^1.1.11",
  sonner: "^2.0.7",
  "next-themes": "^0.4.6",
};

/**
 * Tailwind CDN config shared between the HTML template and JS setup.
 */
const TAILWIND_CONFIG = `{
      corePlugins: { preflight: false },
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            background: 'var(--background)',
            foreground: 'var(--foreground)',
            card: { DEFAULT: 'var(--card)', foreground: 'var(--card-foreground)' },
            popover: { DEFAULT: 'var(--popover)', foreground: 'var(--popover-foreground)' },
            primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
            secondary: { DEFAULT: 'var(--secondary)', foreground: 'var(--secondary-foreground)' },
            muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
            accent: { DEFAULT: 'var(--accent)', foreground: 'var(--accent-foreground)' },
            destructive: { DEFAULT: 'var(--destructive)' },
            border: 'var(--border)',
            input: 'var(--input)',
            ring: 'var(--ring)',
          },
          borderRadius: {
            lg: 'var(--radius)',
            md: 'calc(var(--radius) - 2px)',
            sm: 'calc(var(--radius) - 4px)',
          },
        },
      },
    }`;

/**
 * Build the sandbox HTML template. The `isDark` flag controls
 * whether the dark class is applied to <html> and <body>.
 */
function buildSandboxHtml(isDark: boolean): string {
  const darkClass = isDark ? ' class="dark"' : "";
  return `<!DOCTYPE html>
<html lang="en"${darkClass}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config = ${TAILWIND_CONFIG}</script>
  <style>
    :root {
      --radius: 0.625rem;
      --background: oklch(1 0 0);
      --foreground: oklch(0.145 0 0);
      --card: oklch(1 0 0);
      --card-foreground: oklch(0.145 0 0);
      --popover: oklch(1 0 0);
      --popover-foreground: oklch(0.145 0 0);
      --primary: oklch(0.205 0 0);
      --primary-foreground: oklch(0.985 0 0);
      --secondary: oklch(0.97 0 0);
      --secondary-foreground: oklch(0.205 0 0);
      --muted: oklch(0.97 0 0);
      --muted-foreground: oklch(0.556 0 0);
      --accent: oklch(0.97 0 0);
      --accent-foreground: oklch(0.205 0 0);
      --destructive: oklch(0.577 0.245 27.325);
      --border: oklch(0.922 0 0);
      --input: oklch(0.922 0 0);
      --ring: oklch(0.708 0 0);
      --chart-1: oklch(0.646 0.222 41.116);
      --chart-2: oklch(0.6 0.118 184.704);
      --chart-3: oklch(0.398 0.07 227.392);
      --chart-4: oklch(0.828 0.189 84.429);
      --chart-5: oklch(0.769 0.188 70.08);
    }
    .dark {
      --background: oklch(0.145 0 0);
      --foreground: oklch(0.985 0 0);
      --card: oklch(0.205 0 0);
      --card-foreground: oklch(0.985 0 0);
      --popover: oklch(0.205 0 0);
      --popover-foreground: oklch(0.985 0 0);
      --primary: oklch(0.922 0 0);
      --primary-foreground: oklch(0.205 0 0);
      --secondary: oklch(0.269 0 0);
      --secondary-foreground: oklch(0.985 0 0);
      --muted: oklch(0.269 0 0);
      --muted-foreground: oklch(0.708 0 0);
      --accent: oklch(0.269 0 0);
      --accent-foreground: oklch(0.985 0 0);
      --destructive: oklch(0.704 0.191 22.216);
      --border: oklch(1 0 0 / 10%);
      --input: oklch(1 0 0 / 15%);
      --ring: oklch(0.556 0 0);
      --chart-1: oklch(0.488 0.243 264.376);
      --chart-2: oklch(0.696 0.17 162.48);
      --chart-3: oklch(0.769 0.188 70.08);
      --chart-4: oklch(0.627 0.265 303.9);
      --chart-5: oklch(0.645 0.246 16.439);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; border-color: var(--border); }
    button { background: transparent; cursor: pointer; }
    input, textarea, select { background: transparent; }
    body {
      background: var(--background);
      color: var(--foreground);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      padding: 24px;
      min-height: 100vh;
    }
  </style>
</head>
<body${darkClass}>
  <div id="root"></div>
</body>
</html>`;
}

/**
 * Build the sandbox styles.css with both light and dark theme variables.
 */
function buildStylesCss(isDark: boolean): string {
  return `
/* Light theme CSS variables (default) */
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
}

/* Dark theme CSS variables */
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
}

/* Base reset (mirrors Tailwind v4 preflight) */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: var(--border);
}
html { color-scheme: ${isDark ? "dark" : "light"}; }
body {
  background: var(--background);
  color: var(--foreground);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  padding: 24px;
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
img, svg, video, canvas { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; color: inherit; background: transparent; }
button { cursor: pointer; }

/* Focus ring fix: Tailwind v3 CDN uses outline-based focus,
   but our components use ring-* utilities that map to box-shadow
   in v3. Override the default focus outline. */
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
input:focus-visible, textarea:focus-visible, select:focus-visible {
  outline: none;
}
`;
}

/**
 * Build the tailwind-setup.ts file that configures the Tailwind CDN
 * and sets the dark class based on the parent theme.
 */
function buildTailwindSetup(isDark: boolean): string {
  return `if (typeof window !== "undefined" && (window as any).tailwind) {
  (window as any).tailwind.config = ${TAILWIND_CONFIG};
}
// Set theme class based on parent app
${isDark ? 'document.documentElement.classList.add("dark");' : 'document.documentElement.classList.remove("dark");'}
export {};
`;
}

interface PreviewPaneProps {
  code: string | null;
  isLoading: boolean;
  className?: string;
}

const PreviewPane = ({ code, isLoading, className }: PreviewPaneProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const files = React.useMemo(() => {
    if (!code) return null;

    const transformedCode = transformForSandpack(code);

    const fileMap: Record<string, { code: string; hidden?: boolean }> = {};

    // Add all component and utility files (hidden from Sandpack UI)
    for (const [path, content] of Object.entries(PREVIEW_FILES)) {
      fileMap[path] = { code: content, hidden: true };
    }

    // The generated code becomes the main App component
    fileMap["/App.tsx"] = { code: transformedCode };

    // Global styles with both light and dark theme variables
    fileMap["/styles.css"] = {
      code: buildStylesCss(isDark),
      hidden: true,
    };

    // Tailwind config (runs before render to configure Tailwind CDN)
    fileMap["/tailwind-setup.ts"] = {
      code: buildTailwindSetup(isDark),
      hidden: true,
    };

    // Entry point
    fileMap["/index.tsx"] = {
      code: `import "./tailwind-setup";
import "./styles.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
      hidden: true,
    };

    // next-themes shim (used by sonner.tsx)
    fileMap["/next-themes-shim.ts"] = {
      code: `export function useTheme() {
  return { theme: "${isDark ? "dark" : "light"}", setTheme: () => {}, resolvedTheme: "${isDark ? "dark" : "light"}" };
}
export function ThemeProvider({ children }: { children: React.ReactNode }) { return children; }
`,
      hidden: true,
    };

    // Custom HTML template with theme-aware dark class for flash-free rendering
    fileMap["/public/index.html"] = {
      code: buildSandboxHtml(isDark),
      hidden: true,
    };

    return fileMap;
  }, [code, isDark]);

  // Loading / empty state
  if (isLoading || !files) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-background",
          className,
        )}
      >
        {isLoading ? (
          <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Preview will appear here once code is generated
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden bg-background", className)}>
      <style>{`
        .preview-sandbox { display: flex; flex-direction: column; height: 100%; }
        .preview-sandbox > div { height: 100% !important; }
        .preview-sandbox .sp-layout {
          flex: 1 !important;
          height: 100% !important;
          border: none !important;
          border-radius: 0 !important;
        }
        .preview-sandbox .sp-stack { height: 100% !important; }
        .preview-sandbox .sp-preview-container { height: 100% !important; }
        .preview-sandbox .sp-preview-iframe { height: 100% !important; }
        .preview-sandbox .sp-preview-actions { position: absolute; bottom: 8px; right: 8px; }
      `}</style>
      <div className="preview-sandbox h-full">
        <SandpackProvider
          key={isDark ? "dark" : "light"}
          files={files}
          customSetup={{
            dependencies: SANDBOX_DEPENDENCIES,
          }}
          template="react-ts"
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            activeFile: "/App.tsx",
          }}
        >
          <SandpackLayout>
            <SandpackPreview
              showNavigator={false}
              showOpenInCodeSandbox={false}
              showRefreshButton
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
};

export { PreviewPane };
