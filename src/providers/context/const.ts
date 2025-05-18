//Contract address and ABI for Woke contract

//constants.ts
import nftMarketplace from "./helpers/walletHelpers/NFTMarketplace.json";
// import nftMarketplace from "./NFTMarketplace.json";

// export const WOKE_ADDRESS = process.env.NEXT_PUBLIC_WOKE_NFT_HARDHAT as string;
export const WOKE_ABI = nftMarketplace.abi;
export const WOKE_BYTECODE = nftMarketplace.bytecode;