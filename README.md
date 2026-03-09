# SolanaUI

A component library for building Solana dApps. 29 copy-paste components built on shadcn/ui, Radix, and Tailwind CSS.

Docs and live preview: [solanaui.dev](https://solanaui.dev)

## Components

Swap boxes, trade forms, token inputs, order books, position tables, wallet sheets, transaction toasts, charts, and more. Each component is a single file you own and can modify.

See the full list at [solanaui.dev/docs](https://solanaui.dev/docs).

## Installation

Components are installed individually via the CLI:

```bash
pnpm dlx solanaui@latest add swap-box
```

This copies the component source into your project at `src/components/sol/`. You own the code.

### Prerequisites

- React 19
- Tailwind CSS v4
- shadcn/ui

shadcn/ui primitives are resolved automatically when you install a SolanaUI component.

## Agent Integration

SolanaUI ships a `SKILL.md` for coding agents (Claude Code, Cursor, Windsurf, and others). Install it with:

```bash
npx skills add chambaz/solanaui
```

Or copy `SKILL.md` from the repo root into your project's `.claude/skills/` directory.

## Development

```bash
pnpm install
pnpm dev
```

The docs site runs at `http://localhost:3000`. Built with Next.js 16, Fumadocs, and React 19.

```bash
pnpm build     # Production build (includes type checking)
pnpm lint      # Biome lint
pnpm format    # Biome format
```

## License

MIT
