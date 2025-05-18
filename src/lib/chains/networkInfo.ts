import { arb_logo, base_logo, bsc_logo, hardhat_logo, matic_logo } from "../../../public/img/chain_logos";
import { NetworkInfoProps } from "../../../types/network-types";

export const networkInfo: Record<string, NetworkInfoProps> = {
    hardhat: {
        iconUrls: [hardhat_logo],
        displayName: "Hardhat",
        contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        environment: "testnet",
        active: true,
    },
    polygon: {
        iconUrls: [matic_logo],
        displayName: "Polygon Mainnet",
        contractAddress: "",
        environment: "mainnet",
        active: true,

    },
    arb: {
        iconUrls: [arb_logo],
        displayName: "Arbitrum",
        contractAddress: "",
        environment: "mainnet",
        active: false,

    },
    polygon_amoy: {
        iconUrls: [matic_logo],
        displayName: "Polygon Amoy",
        contractAddress: "",
        environment: "testnet",
        active: false,

    },
    polygon_mumbai: {
        iconUrls: [matic_logo],
        displayName: "Polygon Mumbai",
        contractAddress: "",
        environment: "testnet",
        active: false,
    },
    bsc: {
        iconUrls: [bsc_logo],
        displayName: "BSC",
        contractAddress: "",
        environment: "mainnet",
        active: false,
    },
    base: {
        iconUrls: [base_logo],
        displayName: "Base",
        contractAddress: "",
        environment: "mainnet",
        active: false,
    },
    base_sepolia: {
        iconUrls: [base_logo],
        displayName: "Base Sepolia",
        contractAddress: "",
        environment: "testnet",
        active: false,
    },
};
