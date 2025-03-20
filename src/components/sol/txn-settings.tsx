import React from "react";

import { IconSettings } from "@tabler/icons-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type TxnSettingsType = {
  priority: string;
  priorityFeeCap: "dynamic" | number;
};

type TxnSettingsContextType = {
  settings: TxnSettingsType;
  updateSettings: (newSettings: Partial<TxnSettingsType>) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const TxnSettingsContext = React.createContext<
  TxnSettingsContextType | undefined
>(undefined);

const TxnSettingsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [settings, setSettings] = React.useState<TxnSettingsType>({
    priority: "normal",
    priorityFeeCap: "dynamic",
  });

  const updateSettings = (newSettings: Partial<TxnSettingsType>) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  return (
    <TxnSettingsContext.Provider
      value={{ settings, updateSettings, isOpen, setIsOpen }}
    >
      {children}
    </TxnSettingsContext.Provider>
  );
};

const useTxnSettings = () => {
  const context = React.useContext(TxnSettingsContext);
  if (context === undefined) {
    throw new Error("useTxnSettings must be used within a TxnSettingsProvider");
  }
  return context;
};

type TxnSettingsProps = {
  trigger?: React.ReactNode;
};

const TxnSettings = ({ trigger }: TxnSettingsProps) => {
  const { settings, updateSettings, isOpen, setIsOpen } = useTxnSettings();
  const [tempSettings, setTempSettings] =
    React.useState<TxnSettingsType>(settings);
  const [manualFee, setManualFee] = React.useState("");

  const handleSave = () => {
    updateSettings(tempSettings);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSettings(settings);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <IconSettings size={16} />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent side="bottom" className="p-6">
        <form
          className="space-y-10"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Priority fee</h4>
              <p className="text-sm text-muted-foreground">
                Set the priority fee for your transactions.
              </p>
            </div>
            <ToggleGroup
              type="single"
              className="justify-start"
              value={tempSettings.priority}
              onValueChange={(value) =>
                setTempSettings((prev) => ({ ...prev, priority: value }))
              }
            >
              <ToggleGroupItem value="normal">Normal</ToggleGroupItem>
              <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
              <ToggleGroupItem value="turbo">Turbo</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Priority fee cap</h4>
              <p className="text-sm text-muted-foreground">
                Set the priority fee cap for your transactions.
              </p>
            </div>
            <ToggleGroup
              type="single"
              className="justify-start"
              value={
                tempSettings.priorityFeeCap === "dynamic" ? "dynamic" : "manual"
              }
              onValueChange={(value) => {
                if (value === "dynamic") {
                  setTempSettings((prev) => ({
                    ...prev,
                    priorityFeeCap: "dynamic",
                  }));
                } else if (value === "manual") {
                  setTempSettings((prev) => ({ ...prev, priorityFeeCap: 0 }));
                }
              }}
            >
              <ToggleGroupItem value="manual">Manual</ToggleGroupItem>
              <ToggleGroupItem value="dynamic">Dynamic</ToggleGroupItem>
            </ToggleGroup>
            {tempSettings.priorityFeeCap !== "dynamic" && (
              <Input
                type="number"
                placeholder="Enter priority fee cap"
                value={manualFee}
                onChange={(e) => {
                  const value = e.target.value;
                  setManualFee(value);
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue)) {
                    setTempSettings((prev) => ({
                      ...prev,
                      priorityFeeCap: numValue,
                    }));
                  }
                }}
                className="mt-2"
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit">Save</Button>
            <Button variant="link" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export { TxnSettingsProvider, TxnSettings, useTxnSettings };
export type { TxnSettingsType };
