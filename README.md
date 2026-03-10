# SolanaUI

Beautifully designed UI components and AI Agent tooling for Solana builders.

Documentation and examples: [solanaui.dev](https://solanaui.dev)

## Installation

SolanaUI uses the shadcn registry. Add the registry to your `components.json`:

```json
{
  "registries": {
    "@solanaui": "https://solanaui.dev/r/{name}.json"
  }
}
```

Then install components individually:

```bash
pnpm dlx shadcn@latest add @solanaui/swap-box
```

This copies the component source into your project at `components/sol/`. The components are intended to be modified and customized to your project needs. You own the code.

### Prerequisites

- React 19
- Tailwind CSS v4
- shadcn/ui initialized (`pnpm dlx shadcn@latest init`)

## Agent Integration

SolanaUI ships a `SKILL.md` for coding agents (Claude Code, OpenCode, Cursor, Windsurf, and others). Install it with:

```bash
npx skills add chambaz/solanaui
```

Or copy `SKILL.md` from the repo root into your project's `.claude/skills/` directory.

## Development

```bash
pnpm install
pnpm dev
```

The docs site runs at `http://localhost:3000`

```bash
pnpm build     # Production build (includes type checking)
pnpm lint      # Biome lint
pnpm format    # Biome format
```

## License

MIT
