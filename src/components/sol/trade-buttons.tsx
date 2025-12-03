import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const TradeButtons = () => {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      spacing={2}
      size="sm"
      className="w-full"
    >
      <ToggleGroupItem
        value="long"
        aria-label="Toggle long"
        className="bg-green-700 hover:bg-green-600 data-[state=on]:bg-green-600 border-r-0 w-full"
      >
        Long
      </ToggleGroupItem>
      <ToggleGroupItem
        value="short"
        aria-label="Toggle short"
        className="bg-red-700 hover:bg-red-600 data-[state=on]:bg-red-600 border-l-0 w-full"
      >
        Short
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export { TradeButtons };
