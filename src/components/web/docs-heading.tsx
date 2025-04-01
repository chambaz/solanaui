import Link from "next/link";

import { IconLink } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

type DocsHeadingProps = {
  children: React.ReactNode;
  href: string;
  className?: string;
};

const DocsH1 = ({ children, href, className }: DocsHeadingProps) => {
  return (
    <Link href={href} className="no-underline">
      <h1 className={cn("flex items-baseline gap-2", className)}>
        <IconLink size={20} className="text-muted-foreground" /> {children}
      </h1>
    </Link>
  );
};

const DocsH2 = ({ children, href, className }: DocsHeadingProps) => {
  return (
    <Link href={href} className="no-underline">
      <h2 className={cn("flex items-baseline gap-2", className)}>
        <IconLink size={20} className="text-muted-foreground" />
        {children}
      </h2>
    </Link>
  );
};

export { DocsH1, DocsH2 };
