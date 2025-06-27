import { ethers } from "ethers";

export type EthAddress = string & { readonly __brand: unique symbol };

interface WalletData {
    balance: string;
    address: EthAddress;
    chainId: string;
}

async function getWalletData(address: string, provider: ethers.BrowserProvider, ethereum: any): Promise<WalletData> {
    const balanceInWei = await provider.getBalance(address);
    const balance = ethers.formatEther(balanceInWei);
    const chainIdHex = await ethereum.request({ method: "eth_chainId" });
    const chainId = parseInt(chainIdHex, 16).toString();
    return { address: address as EthAddress, balance, chainId };
}

export const CheckIfWalletConnected = async (): Promise<WalletData | null> => {
    try {
        if (typeof window === "undefined") return null;
        const { ethereum } = window;
        if (!ethereum) return null;

        const accounts: string[] = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length === 0) return null;

        const provider = new ethers.BrowserProvider(ethereum);
        return await getWalletData(accounts[0], provider, ethereum);
    } catch (error) {
        console.error("Error checking if wallet is connected:", error);
        return null;
    }
};

export const ConnectWallet = async (): Promise<WalletData | null> => {
    try {
        if (typeof window === "undefined") return null;
        const { ethereum } = window;
        if (!ethereum) return null;

        const accounts: string[] = await ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length === 0) return null;

        const provider = new ethers.BrowserProvider(ethereum);
        return await getWalletData(accounts[0], provider, ethereum);
    } catch (error) {
        console.warn("[Con Wall]Error connecting wallet:", error);
        return null;
    }
};