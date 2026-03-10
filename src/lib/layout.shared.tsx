import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <img src="/solanaui-logo.png" alt="SolanaUI" width={28} height={28} />
          <span className="font-semibold">SolanaUI</span>
        </div>
      ),
    },
    githubUrl: "https://github.com/chambaz/solanaui",
  };
}
