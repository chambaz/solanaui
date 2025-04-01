import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DocsInstallTabs = () => {
  return (
    <div className="flex w-full items-center border-b">
      <Button variant="ghost" className="rounded-none border-b border-primary">
        Manual
      </Button>
      <Button
        variant="ghost"
        className="cursor-default gap-3 rounded-none hover:bg-transparent hover:text-foreground/80"
      >
        CLI{" "}
        <Badge className="bg-lime-300 px-1.5 py-px text-xs text-neutral-900 hover:bg-lime-300 hover:text-neutral-900">
          coming soon
        </Badge>
      </Button>
    </div>
  );
};

export { DocsInstallTabs };
