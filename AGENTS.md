# AGENTS.md

Coding agent instructions for the **SolanaUI** repository — a Solana-focused component library and documentation site built with Next.js 16, React 19, Fumadocs, and shadcn/ui.

---

## Build / Lint / Format Commands

Package manager is **pnpm**. Do not use npm or yarn.

```bash
pnpm install          # Install dependencies (runs fumadocs-mdx postinstall)
pnpm dev              # Start dev server (Next.js)
pnpm build            # Production build (also validates types)
pnpm lint             # Lint with Biome (biome check)
pnpm format           # Auto-format with Biome (biome format --write)
```

There is **no test framework** configured. No Jest, Vitest, or test scripts exist. Validate changes with `pnpm build` (which includes TypeScript type checking) and `pnpm lint`.

---

## Tech Stack & Structure

Next.js 16 (App Router, RSC default) · React 19 · TypeScript strict · Fumadocs (MDX docs) · shadcn/ui (new-york) · Radix UI · Tailwind CSS v4 · Biome (NOT ESLint/Prettier) · CVA · lucide-react · lightweight-charts + recharts

```
src/
  app/                    # App Router pages, layouts, API routes
    (home)/               # Marketing/example pages (route group)
    docs/                 # Documentation pages (Fumadocs)
    global.css            # Tailwind v4 entry + CSS variable theming
  components/
    sol/                  # Solana UI components (the library)
    ui/                   # shadcn/ui base primitives
    docs/                 # Documentation helper components
  lib/
    utils.ts              # cn() utility (clsx + tailwind-merge)
    source.ts             # Fumadocs content source loader
content/docs/             # MDX documentation files
```

Path aliases: `@/*` → `./src/*`, `@/.source` → `.source` (Fumadocs generated)

---

## Code Style

### Formatting (Biome — not ESLint/Prettier)

Config in `biome.json`: 2-space indentation, double quotes, recommended React/Next.js lint rules, auto-organized imports. Always run `pnpm lint` before committing.

### Imports

Biome auto-organizes. Grouping: (1) external packages, (2) `@/` aliased imports, (3) relative imports. Use `import type { ... }` for type-only imports. Import Radix primitives with namespace imports (`import * as SliderPrimitive from "@radix-ui/react-slider"`).

### Component Patterns

**`src/components/sol/` (Solana UI components):**

- Arrow function components with `const` declarations
- Props typed inline or via `interface` with `Props` suffix
- Named exports at the bottom of the file (not inline)
- `"use client"` directive at the top when hooks or browser APIs are used
- Use `React.useState`, `React.useRef`, `React.useEffect` (namespace style, not destructured)

```tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TokenInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

const TokenInput = ({ value, onChange }: TokenInputProps) => {
  const [internal, setInternal] = React.useState(value ?? "");
  return <div>...</div>;
};

export { TokenInput };
```

**`src/components/ui/` (shadcn/ui primitives):**

- `function` declarations (shadcn convention)
- Props via `React.ComponentProps<"element">` intersection types
- Include `data-slot` attributes for component identification
- Use CVA for variant-based styling

```tsx
function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

### Naming Conventions

| Element          | Convention        | Example                      |
|------------------|-------------------|------------------------------|
| Files            | kebab-case        | `token-card.tsx`             |
| Components       | PascalCase        | `TokenCard`                  |
| Props types      | PascalCase+Props  | `TradeChartProps`            |
| Constants        | UPPER_SNAKE_CASE  | `LIGHT_COLORS`, `DARK_COLORS`|
| Functions/vars   | camelCase         | `handleValueChange`          |
| CSS variables    | kebab-case        | `--background`, `--border`   |
| Route groups     | parentheses       | `(home)`                     |

### Styling

- Use Tailwind utility classes everywhere
- Compose classes with `cn()` from `@/lib/utils` (clsx + tailwind-merge)
- Theme colors via CSS variables: `bg-background`, `text-muted-foreground`, `border-border`
- Direct Tailwind colors for semantic accents: `text-green-500`, `bg-red-500/15`
- CSS theming uses oklch color space in `global.css`

### Error Handling

- `try/catch` with `console.error()` and fallback UI for build-time operations
- `notFound()` from `next/navigation` for missing pages
- State machines for async UI: `"loading" | "loaded" | "error"` pattern
- Nullish coalescing (`??`) and optional chaining (`?.`) throughout
- No error boundaries currently used

### React / Next.js Patterns

- Server Components are the default; only add `"use client"` when necessary
- Next.js 16 typed route APIs: `PageProps<"/docs/[[...slug]]">`, `LayoutProps<"/">`
- Async server components: `const params = await props.params`
- Use `generateStaticParams()` and `generateMetadata()` for static generation
- Use `next/image` for images (remote patterns configured in `next.config.mjs`)

---

## Documentation (MDX)

Component docs live in `content/docs/components/` following: (1) frontmatter with `title`/`description`, (2) `<ComponentDemo>` live preview, (3) install instructions via tabs, (4) usage code block, (5) `<ComponentCode name="component-name" />` for full source. Sidebar order is in `content/docs/components/meta.json`.

---

## Git Conventions

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Lowercase, no trailing period
- Short, descriptive messages (e.g., `feat: add token-input component`)
