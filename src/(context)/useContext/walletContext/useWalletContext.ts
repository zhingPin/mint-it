import { useContext } from "react";
import { WalletContextProps } from "../../context/walletContext";
import { WalletContext } from "@/(context)/providers/walletProvider";

export const useWalletContext = (): WalletContextProps => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWalletContext must be used within a WalletProvider");
    }
    return context;
};