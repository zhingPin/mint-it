import { arb_logo, base_logo, bsc_logo, hardhat_logo, matic_logo } from "../../../public/img/chain_logos";
import { NetworkInfoProps } from "../../../types/network-types";

export const networkInfo: Record<string, NetworkInfoProps> = {
    hardhat: {
        iconUrls: [hardhat_logo],
        displayName: "Hardhat",
        contracts: {
            nft: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
            marketplace: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
        },
        environment: "testnet",
        active: true,
    },

    polygon_pos: {
        iconUrls: [matic_logo],
        displayName: "Polygon Pos",
        contracts: {
            nft: "0xCCa61FbF2b09c4BaA442Ed39d52EEc0D080e028c",
            marketplace: "0x55Ba126c95dfB215b4A528caD1A8435C25fB90F8"
        },
        environment: "mainnet",
        active: true,

    },
    arb: {
        iconUrls: [arb_logo],
        displayName: "Arbitrum",
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
        contracts: {
            nft: "0xf78cA5Dad15EEf6AC6c2Edd7EbC12ED91F6A634a",
            marketplace: "0x3A28217Ffea5e0Cd4C3F5e3A895f5D9Da8D02c6e"
        },
        environment: "testnet",
        active: true,

    },
    bsc: {
        iconUrls: [bsc_logo],
        displayName: "BSC",
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
        contracts: {
            nft: "",
            marketplace: ""
        },
        environment: "testnet",
        active: false,
    },
};
