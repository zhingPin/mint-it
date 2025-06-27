"use client";
import WalletProvider from "./walletProvider";
import NftProvider from "./nftProvider";
import { IpfsProvider } from "./ipfsProvider";
import { CombinedContextProvider } from "../useContext";

export const WokeProvider: React.FC<{ children: React.ReactNode }> = ({
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