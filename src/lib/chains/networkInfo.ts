import { arb_logo, base_logo, bsc_logo, hardhat_logo, matic_logo } from "../../../public/img/chain_logos";
import { NetworkInfoProps } from "../../../types/network-types";

export const networkInfo: Record<string, NetworkInfoProps> = {
    hardhat: {
        iconUrls: [hardhat_logo],
        displayName: "Hardhat",
        contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        contracts: {
            nft: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
            marketplace: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
        },
        environment: "testnet",
        active: true,
    },

    polygon: {
        iconUrls: [matic_logo],
        displayName: "Polygon Mainnet",
        contractAddress: "",
        contracts: {
            nft: "",
            marketplace: ""
        },
        environment: "mainnet",
        active: true,

    },
    arb: {
        iconUrls: [arb_logo],
        displayName: "Arbitrum",
        contractAddress: "",
        contracts: {
            nft: "",
            marketplace: ""
        },
        environment: "mainnet",
        active: false,

    },
    polygon_amoy: {
        iconUrls: [matic_logo],
        displayName: "Polygon Amoy",
        contractAddress: "",
        contracts: {
            nft: "",
            marketplace: ""
        },
        environment: "testnet",
        active: false,

    },
    polygon_mumbai: {
        iconUrls: [matic_logo],
        displayName: "Polygon Mumbai",
        contractAddress: "",
        contracts: {
            nft: "",
            marketplace: ""
        },
        environment: "testnet",
        active: false,
    },
    bsc: {
        iconUrls: [bsc_logo],
        displayName: "BSC",
        contractAddress: "",
        contracts: {
            nft: "",
            marketplace: ""
        },
        environment: "mainnet",
        active: false,
    },
    base: {
        iconUrls: [base_logo],
        displayName: "Base",
        contractAddress: "",
        contracts: {
            nft: "",
            marketplace: ""
        },
        environment: "mainnet",
        active: false,
    },
    base_sepolia: {
        iconUrls: [base_logo],
        displayName: "Base Sepolia",
        contractAddress: "",
        contracts: {
            nft: "",
            marketplace: ""
        },
        environment: "testnet",
        active: false,
    },
};
