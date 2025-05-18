"use client";
import React, { ReactNode } from "react";
import WalletProvider from "./walletProvider";
import NftProvider from "./nftProvider";
import { CombinedContextProvider } from "./context";
import { IpfsProvider } from "./ipfsProvider";

export const WokeProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    return (
        <WalletProvider>
            <IpfsProvider>
                <NftProvider>
                    <CombinedContextProvider>{children}</CombinedContextProvider>
                </NftProvider>
            </IpfsProvider>
        </WalletProvider>
    );
};