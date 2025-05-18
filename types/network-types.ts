import { StaticImageData } from "next/image";

// Define types for the network configuration
export interface NetworkConfigProps {
    chainId: string;
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
}

export interface NetworkInfoProps {
    iconUrls: string | StaticImageData[];
    displayName: string;
    contractAddress: string;
    environment: "mainnet" | "testnet";
    active: boolean,
    dex?: string[]
}

export interface Dex {
    name: string;
    url: string;
    iconUrl: string | StaticImageData[]; // You can use images here
    mainnetContractAddress: string;
    testnetContractAddress: string;
}
