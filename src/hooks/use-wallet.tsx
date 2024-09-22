import React from "react";
import {
  useWallet as useWalletAdapter,
  WalletProvider as WalletAdapterProvider,
  WalletProviderProps,
} from "@solana/wallet-adapter-react";

interface ExtendedWalletContextState
  extends ReturnType<typeof useWalletAdapter> {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const WalletContext = React.createContext<ExtendedWalletContextState | null>(
  null,
);

export function WalletProvider({ children, ...props }: WalletProviderProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <WalletAdapterProvider {...props}>
      <InnerWalletProvider isOpen={isOpen} setIsOpen={setIsOpen}>
        {children}
      </InnerWalletProvider>
    </WalletAdapterProvider>
  );
}

function InnerWalletProvider({
  children,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const wallet = useWalletAdapter();
  const extendedWallet: ExtendedWalletContextState = {
    ...wallet,
    isOpen,
    setIsOpen,
  };

  return (
    <WalletContext.Provider value={extendedWallet}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): ExtendedWalletContextState {
  const context = React.useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
