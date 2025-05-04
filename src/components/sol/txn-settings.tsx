"use client";

import React from "react";

import { SettingsIcon } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type TxnSettingsType = {
  // Priority fee settings
  priority: "normal" | "medium" | "turbo";
  priorityFeeCap: "dynamic" | number;

  // Slippage settings
  slippageMode: "dynamic" | "fixed";
  slippageValue: number;
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
    slippageMode: "dynamic",
    slippageValue: 1.0,
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
  const [manualSlippage, setManualSlippage] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      setTempSettings(settings);
    }
  }, [isOpen, settings]);

  const handleSave = () => {
    updateSettings(tempSettings);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSettings(settings);
    setIsOpen(false);
  };

  const handleSlippagePresetChange = (value: string) => {
    const slippageMap: Record<string, number> = {
      low: 0.5,
      normal: 1.0,
      high: 1.5,
    };

    setTempSettings((prev) => ({
      ...prev,
      slippageValue: slippageMap[value] || prev.slippageValue,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <SettingsIcon size={16} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transaction Settings</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-10 py-4"
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
                setTempSettings((prev) => ({
                  ...prev,
                  priority: value as "normal" | "medium" | "turbo",
                }))
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
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Slippage mode</h4>
              <p className="text-sm text-muted-foreground">
                Set a manual slippage or let us calculate optimal slippage for
                you.
              </p>
            </div>
            <ToggleGroup
              type="single"
              className="justify-start"
              value={tempSettings.slippageMode}
              onValueChange={(value) => {
                if (value) {
                  setTempSettings((prev) => ({
                    ...prev,
                    slippageMode: value as "dynamic" | "fixed",
                  }));
                }
              }}
            >
              <ToggleGroupItem value="dynamic">Dynamic</ToggleGroupItem>
              <ToggleGroupItem value="fixed">Manual</ToggleGroupItem>
            </ToggleGroup>

            {tempSettings.slippageMode === "fixed" && (
              <div className="mt-4 space-y-4">
                <ToggleGroup
                  type="single"
                  className="justify-start"
                  value={
                    tempSettings.slippageValue === 0.5
                      ? "low"
                      : tempSettings.slippageValue === 1.0
                        ? "normal"
                        : tempSettings.slippageValue === 1.5
                          ? "high"
                          : "custom"
                  }
                  onValueChange={(value) => {
                    if (value && value !== "custom") {
                      handleSlippagePresetChange(value);
                    }
                  }}
                >
                  <ToggleGroupItem value="low" className="h-auto w-full py-1">
                    <div className="flex w-full flex-col items-center">
                      <span>Low</span>
                      <span className="text-sm">0.5 %</span>
                    </div>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="normal"
                    className="h-auto w-full py-1"
                  >
                    <div className="flex w-full flex-col items-center">
                      <span>Normal</span>
                      <span className="text-sm">1 %</span>
                    </div>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="high" className="h-auto w-full py-1">
                    <div className="flex w-full flex-col items-center">
                      <span>High</span>
                      <span className="text-sm">1.5 %</span>
                    </div>
                  </ToggleGroupItem>
                </ToggleGroup>

                <div>
                  <p className="mb-2 text-sm">Or set custom value</p>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      value={manualSlippage}
                      onChange={(e) => {
                        const value = e.target.value;
                        setManualSlippage(value);
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue)) {
                          setTempSettings((prev) => ({
                            ...prev,
                            slippageValue: numValue,
                          }));
                        }
                      }}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 transform">
                      %
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { TxnSettingsProvider, TxnSettings, useTxnSettings };
export type { TxnSettingsType };
