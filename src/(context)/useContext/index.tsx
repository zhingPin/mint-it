"use client";
import { createContext, ReactNode, useContext } from "react";
import { WalletContextProps } from "../providers/walletProvider";
import { WalletContext } from "../providers/walletProvider";
import { NftContextProps } from "../providers/nftProvider";
import { NftContext } from "../providers/nftProvider";

// Combined Context Type
export interface WokeContextProps extends WalletContextProps, NftContextProps { }

// Create Combined Context
export const WokeContext = createContext<WokeContextProps | undefined>(undefined);

export const CombinedContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const walletContext = useContext(WalletContext);
    const nftContext = useContext(NftContext);

    if (!walletContext || !nftContext) {
        throw new Error("WokeProvider must be used within WalletProvider");
    }

    // if () {
    //     throw new Error("WokeProvider must be used within NftProvider");
    // }

    const combinedContextValue: WokeContextProps = {
        ...walletContext,
        ...nftContext,
    };

    return (
        <WokeContext.Provider value={combinedContextValue}>
            {children}
        </WokeContext.Provider>
    );
};