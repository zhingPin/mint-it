"use client";
import { useState, useEffect, createContext, useCallback } from "react";
import { handleNetworkSwitch } from "../../../utils/helpers/wallet/switchNetwork";
import { DEFAULT_NETWORK } from "../useContext/walletContext/const";
import { CheckIfWalletConnected, ConnectWallet } from "../../../utils/helpers/wallet/connectWallet";
import { getNetworkKeyFromChainId } from "../../../helpers/networkHelpers";

export interface WalletContextProps {
    currentAccount: string;
    setAccount: React.Dispatch<React.SetStateAction<string>>;
    accountBalance: string;
    handleConnectWallet: () => Promise<void>;
    currentNetwork: string;
    setCurrentNetwork: React.Dispatch<React.SetStateAction<string>>;
    walletError: string;
    setWalletError: React.Dispatch<React.SetStateAction<string>>;

}

export const WalletContext = createContext<WalletContextProps | undefined>(
    undefined
);

const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [walletError, setWalletError] = useState<string>("");
    const [currentAccount, setAccount] = useState<string>("");
    const [accountBalance, setAccountBalance] = useState<string>("");
    const [currentNetwork, setCurrentNetwork] = useState<string>("");

    const init = useCallback(async () => {
        const walletData = await CheckIfWalletConnected();

        if (walletData) {
            const networkKey = getNetworkKeyFromChainId(walletData.chainId);
            setAccount(walletData.address);
            setAccountBalance(walletData.balance);
            setCurrentNetwork(networkKey ?? "");
        } else {
            setAccount("");
            setAccountBalance("");
            setCurrentNetwork("");
        }
    }, []);

    useEffect(() => {
        init();
    }, [init]); // Only run once on mount

    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            const handleAccountsChanged = () => {
                init(); // re-run full sync
            };

            const handleChainChanged = () => {
                init(); // re-run full sync
            };

            window.ethereum.on("accountsChanged", handleAccountsChanged);
            window.ethereum.on("chainChanged", handleChainChanged);

            return () => {
                window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
                window.ethereum.removeListener("chainChanged", handleChainChanged);
            };
        }
    }, []); // only once on mount

    const handleConnectWallet = async () => {
        try {
            // Step 1: Check if already connected
            const alreadyConnected = await CheckIfWalletConnected();

            if (alreadyConnected) {
                const { address, balance, chainId } = alreadyConnected;
                const networkKey = getNetworkKeyFromChainId(chainId);

                if (!networkKey) {
                    setWalletError("Unsupported network.");
                    return;
                }

                setAccount(address);
                setAccountBalance(balance);
                setCurrentNetwork(networkKey);
                return;
            }

            // Step 2: Ask to switch (before requesting accounts)
            const switchedNetwork = await handleNetworkSwitch(currentNetwork || DEFAULT_NETWORK);
            if (!switchedNetwork) {
                setWalletError("Please switch to the correct network.");
                return;
            }

            // Step 3: Prompt user to connect wallet if not already
            const walletDetails = await ConnectWallet();
            if (walletDetails) {
                const { address, balance, chainId } = walletDetails;
                const networkKey = getNetworkKeyFromChainId(chainId);

                if (!networkKey) {
                    setWalletError("Unsupported network.");
                    return;
                }

                setAccount(address);
                setAccountBalance(balance);
                setCurrentNetwork(networkKey);
            }
        } catch (error) {
            console.error("Error connecting wallet:", error);
            setWalletError("Could not connect wallet.");
        }
    };



    return (
        <WalletContext.Provider
            value={{
                currentAccount,
                setAccount,
                accountBalance,
                currentNetwork,
                setCurrentNetwork,
                handleConnectWallet,
                walletError,
                setWalletError,

            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export default WalletProvider;