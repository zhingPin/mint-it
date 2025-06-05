"use client";
import React, { useState, useEffect, ReactNode, createContext } from "react";
import {
    CheckIfWalletConnected,
    ConnectWallet,
} from "./context/helpers/walletHelpers/connectingContracts";
import { getCurrentNetwork, handleNetworkSwitch } from "@/lib/chainConfig";
import { WalletContextProps } from "./context/walletContext";
import { networkConfig } from "@/lib/chains/networkConfig";

export const WalletContext = createContext<WalletContextProps | undefined>(
    undefined
);

const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [walletError, setWalletError] = useState<string>("");
    const [currentAccount, setAccount] = useState<string>("");
    const [accountBalance, setAccountBalance] = useState<string>("");
    const [currentNetwork, setCurrentNetwork] = useState<string>("hardhat");
    const [isConnected, setIsConnected] = useState<boolean>(false);

    // useEffect(() => {
    //     const init = async () => {
    //         const walletData = await CheckIfWalletConnected();

    //         if (walletData) {
    //             setAccount(walletData.address);
    //             setAccountBalance(walletData.balance);
    //             setIsConnected(true);
    //             console.log("Wallet connected:", walletData.address);
    //         } else {
    //             setIsConnected(false);
    //             console.log("Wallet not connected.");
    //         }
    //     };

    //     init();
    // }, []);

    // useEffect(() => {
    //     if (typeof window.ethereum !== "undefined") {
    //         const handleAccountsChanged = (accounts: string[]) => {
    //             setAccount(accounts.length ? accounts[0] : "");
    //         };

    //         const handleChainChanged = async () => {
    //             await fetchCurrentNetwork();
    //         };

    //         // Add event listeners
    //         window.ethereum.on("accountsChanged", handleAccountsChanged);
    //         window.ethereum.on("chainChanged", handleChainChanged);

    //         // Cleanup event listeners on component unmount
    //         return () => {
    //             window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    //             window.ethereum?.removeListener("chainChanged", handleChainChanged);
    //         };
    //     }
    // }, []);

    const handleConnectWallet = async () => {
        if (!currentAccount) {
            try {
                // Ensure the user is on the correct network
                const switchedNetwork = await handleNetworkSwitch(currentNetwork || "hardhat");
                if (!switchedNetwork) {
                    console.error("Failed to switch network.");
                    setWalletError("Please switch to the correct network.");
                    return;
                }

                // Connect the wallet
                const walletDetails = await ConnectWallet();
                if (walletDetails) {
                    const { address, balance, chainId } = walletDetails;
                    setAccount(address);
                    setAccountBalance(balance);
                    setCurrentNetwork(chainId.toString());
                    setIsConnected(true);
                    console.log("Wallet connected:", address);
                    console.log("currentNetwork:", chainId.toString());
                }
            } catch (error) {
                console.error("Error connecting wallet:", error);
                setWalletError("Could not connect wallet.");
                setIsConnected(false);
            }
        }
    };

    const fetchCurrentNetwork = async () => {
        const networkId = await getCurrentNetwork(); // Get the network ID
        if (networkId) {
            const matchingNetwork = Object.entries(networkConfig).find(
                ([, config]) => parseInt(config.chainId, 16) === networkId
            );
            if (matchingNetwork) {
                setCurrentNetwork(matchingNetwork[0]); // Set the matching network key
            } else {
                console.warn("No matching network found for network ID:", networkId);
                setCurrentNetwork(""); // No matching network found
            }
        } else {
            console.warn("Network ID couldn't be fetched.");
            setCurrentNetwork(""); // Network ID couldn't be fetched
        }
    };

    // // Run `fetchCurrentNetwork` on component mount
    // useEffect(() => {
    //     fetchCurrentNetwork();
    // }, []);

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
                isConnected,
                setIsConnected,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export default WalletProvider;