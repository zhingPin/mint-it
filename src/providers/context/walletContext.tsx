"use client";


export interface WalletContextProps {
  currentAccount: string;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
  accountBalance: string;
  handleConnectWallet: () => Promise<void>;
  currentNetwork: string;
  setCurrentNetwork: React.Dispatch<React.SetStateAction<string>>;
  walletError: string;
  setWalletError: React.Dispatch<React.SetStateAction<string>>;
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}



