//constants.ts
import nftMarketplace from "./NFTMarketplace.json";
import gsoe from "./GSOEToken.json";

// export const WOKE_ADDRESS = process.env.NEXT_PUBLIC_WOKE_NFT_HARDHAT as string;
// export const WOKE_ABI = nftMarketplace.abi;
// export const WOKE_BYTECODE = nftMarketplace.bytecode;

// Default network
export const DEFAULT_NETWORK =
    process.env.NODE_ENV !== "production"
        ? "hardhat"
        : (process.env.DEFAULT_NETWORK ?? "polygon"); // Use env or fallback to polygon


// MARKETPLACE
export const NFT_MARKETPLACE_ABI = nftMarketplace.abi;
export const NFT_MARKETPLACE_BYTECODE = nftMarketplace.bytecode;

//MINT STATION
export const GSOE_TOKENS_ABI = gsoe.abi;
export const GSOE_TOKENS_BYTECODE = gsoe.bytecode;