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

type RpcProvider = {
  name: string;
  url: string;
};

type TxnSettingsProps = {
  rpcProviders: RpcProvider[];
};

type TxnSettingsType = {
  priorityFee: string;
  rpcProvider: string;
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

export const TxnSettingsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [settings, setSettings] = React.useState<TxnSettingsType>({
    priorityFee: "normal",
    rpcProvider: process.env.NEXT_PUBLIC_RPC_URL!,
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

const TxnSettings = ({ rpcProviders }: TxnSettingsProps) => {
  const { settings, updateSettings, isOpen, setIsOpen } = useTxnSettings();
  const [tempSettings, setTempSettings] =
    React.useState<TxnSettingsType>(settings);
  const customRpcInputRef = React.useRef<HTMLInputElement>(null);

  const isCustomRpc = !rpcProviders.some(
    (provider) => provider.url === settings.rpcProvider,
  );

  const handleSave = () => {
    const customRpcValue = customRpcInputRef.current?.value || "";
    updateSettings({
      ...tempSettings,
      rpcProvider:
        tempSettings.rpcProvider === "custom"
          ? customRpcValue
          : tempSettings.rpcProvider,
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSettings(settings);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <IconSettings size={16} />
        </Button>
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
              value={tempSettings.priorityFee}
              onValueChange={(value) =>
                setTempSettings((prev) => ({ ...prev, priorityFee: value }))
              }
            >
              <ToggleGroupItem value="normal">Normal</ToggleGroupItem>
              <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
              <ToggleGroupItem value="turbo">Turbo</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">RPC Provider</h4>
              <p className="text-sm text-muted-foreground">
                Set the RPC provider for your transactions.
              </p>
            </div>
            <ToggleGroup
              type="single"
              className="justify-start"
              value={tempSettings.rpcProvider}
              onValueChange={(value) => {
                customRpcInputRef.current!.value = "";
                setTempSettings((prev) => ({ ...prev, rpcProvider: value }));
              }}
            >
              {rpcProviders.map((provider, index) => (
                <ToggleGroupItem key={index} value={provider.url}>
                  {provider.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Input
              ref={customRpcInputRef}
              type="url"
              defaultValue={isCustomRpc ? settings.rpcProvider : ""}
              placeholder="Custom RPC"
              onChange={(e) => {
                setTempSettings((prev) => ({
                  ...prev,
                  rpcProvider: e.target.value,
                }));
              }}
            />
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

export { TxnSettings, useTxnSettings };
export type { TxnSettingsType };
