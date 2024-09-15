import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border">
      <div className="flex h-20 items-center justify-between gap-6 px-8 text-sm text-muted-foreground">
        <p>solanaui &copy; {new Date().getFullYear()}</p>
        <p>
          Built by{" "}
          <Link
            className="border-b border-muted-foreground/30 transition-colors hover:border-transparent"
            href="https://twitter.com/chambaz"
            target="_blank"
            rel="noreferrer"
          >
            @chambaz
          </Link>
        </p>
      </div>
    </footer>
  );
};

export { Footer };
