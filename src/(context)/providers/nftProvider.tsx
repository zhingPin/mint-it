"use client";
import axios from "axios";
import { createContext, useContext } from "react";
import { WalletContext } from "./walletProvider";
import { IpfsContext } from "./ipfsProvider";
import { networkInfo } from "../../../utils/lib/chains/networkInfo";
import { connectToContract, fetchContract } from "../../../utils/helpers/wallet/connectContracts";
import { networkConfig } from "../../../utils/lib/chains/networkConfig";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { CreateNftInput, MarketItem, NftData } from "../../../types/media-types";
import { IPFSHTTPClient } from "ipfs-http-client";

export interface NftContextProps {
    loading?: boolean;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    error?: string;
    setError?: React.Dispatch<React.SetStateAction<string>>;
    fetchNFTsByOwner: (type: "fetchItemsListed" | "fetchMyNFTs") => Promise<NftData[] | undefined>;
    fetchMarketsNFTs: () => Promise<NftData[]>;
    createNFT: (input: CreateNftInput) => Promise<void>
    buyNFT: (listingId: number, tokenId: number, price: string) => Promise<void>; // Updated type
    client?: IPFSHTTPClient; // Replace 'any' with the actual type of your client
}

export const NftContext = createContext<NftContextProps | undefined>(undefined);

const NftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const walletContext = useContext(WalletContext);
    if (!walletContext) {
        throw new Error("NftProvider must be used within WalletProvider");
    }

    const ipfsContext = useContext(IpfsContext);
    if (!ipfsContext) {
        throw new Error("NftProvider must be used within IpfsProvider");
    }

    const { uploadToIpfs } = ipfsContext;
    const { currentAccount, currentNetwork } = walletContext;
    const router = useRouter();

    const createNFT = async (nftData: CreateNftInput): Promise<void> => {
        const {
            name,
            price,
            image,
            media,
            description,
            royaltyPercentage,
            quantity,
            collection,
        } = nftData;

        if (!name || !price || !image) {
            console.error("Missing required NFT data.");
            return;
        }

        const chainId = currentNetwork;

        const metadata = {
            name,
            description,
            image,
            media,
            price,
            royaltyPercentage,
            quantity,
            collection,
            chainId,
        };

        try {
            const metadataBlob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
            const metadataFile = new File([metadataBlob], "metadata.json");

            const metadataUrl = await uploadToIpfs(metadataFile);

            await createSale(metadataUrl, price, royaltyPercentage || 0, quantity || 1);
            console.log("NFT created successfully. URL:", metadataUrl);
            // router.push("/");
        } catch (error) {
            console.error("Error while creating NFT:", error);
        }
    };

    // --- createSale FUNCTION
    const createSale = async (
        url: string,
        formInputPrice: string,
        royaltyPercentage: number,
        quantity: number,
        isReselling: boolean = false,
        id: number = 0
    ): Promise<void> => {
        try {
            console.log("🔵 Create sale URL:", url);

            const price = ethers.parseUnits(formInputPrice, "ether");
            console.log("💱 Parsed price (wei):", price.toString());

            console.log("🌐 Current network:", currentNetwork);
            const contract = await connectToContract(currentNetwork, "marketplace");
            const MintingContract = await connectToContract(currentNetwork, "nft");

            console.log("🏛️ Marketplace contract:", contract?.target);
            console.log("🎨 NFT contract:", MintingContract?.target);

            if (!contract || !MintingContract) {
                console.error("❌ Failed to connect to one or more contracts.");
                return;
            }

            // --- Debug: Check MINTER_ROLE ---
            const MINTER_ROLE = await MintingContract.MINTER_ROLE();
            const hasMinterRole = await MintingContract.hasRole(MINTER_ROLE, contract.target);
            console.log("🧾 MINTER_ROLE hash:", MINTER_ROLE);
            console.log("🏢 Marketplace address:", contract.target);
            console.log("✅ Marketplace has MINTER_ROLE:", hasMinterRole);

            if (!hasMinterRole) {
                throw new Error("Marketplace does not have MINTER_ROLE — cannot mint.");
            }

            const [listingPrice] = await contract.getFees();
            console.log("💸 Listing fee per item:", listingPrice.toString());

            let transaction;
            if (!isReselling) {
                const totalListingFee = listingPrice * BigInt(quantity);
                console.log("🧮 Total listing fee:", totalListingFee.toString());

                transaction = await contract.mintAndList(
                    url,
                    price,
                    royaltyPercentage,
                    quantity,
                    {
                        value: totalListingFee,
                    }
                );
                console.log("transaction", transaction)
            } else {
                console.log("🔁 Reselling token ID:", id);
                transaction = await contract.listItem(id, price, {
                    value: listingPrice,
                });
            }

            console.log("📤 Transaction submitted:", transaction.hash);
            const receipt = await transaction.wait();
            console.log("📥 Transaction receipt:", receipt);

            if (receipt.status !== 1) {
                throw new Error("❌ Transaction failed on-chain.");
            }

            console.log("✅ Sale created successfully.");
            return receipt;
        } catch (error) {
            console.error("🚨 Error while creating sale:", error);
        }
    };




    const getActiveNetworks = (): string[] => {
        return Object.keys(networkInfo).filter(
            (network) =>
                networkInfo[network].active &&
                networkInfo[network].contracts.marketplace &&
                networkInfo[network].contracts.nft
        );
    };

    const parseNFTMetadata = async (tokenURI: string, tokenId: string, network: string) => {
        try {
            const { data } = await axios.get(tokenURI, { timeout: 5000 });
            return {
                name: data.name,
                description: data.description,
                image: data.image,
                media: data.media,
                video: data.video,
                audio: data.audio,
                royaltyPercentage: data.royaltyPercentage,
                quantity: data.quantity,
                website: data.website,
                collection: data.collection,
                chainId: data.chainId,
            };
        } catch (err) {
            console.error(`Failed to fetch metadata for token ${tokenId} on ${network}:`, err);
            return null;
        }
    };
    const createNftData = async (
        item: MarketItem,
        tokenURI: string,
        network: string,
        currentAccount?: string
    ): Promise<NftData | null> => {
        const metadata = await parseNFTMetadata(tokenURI, item.tokenId.toString(), network);
        if (!metadata) return null;

        const chainId = metadata.chainId;
        const nftContractAddress = networkInfo[network]?.contracts?.nft;
        const marketplaceAddress = networkInfo[network]?.contracts?.marketplace;

        return {
            tokenId: item.tokenId.toString(),
            listingId: item.listingId.toString(),
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            media: metadata.media,
            price: ethers.formatUnits(item.price.toString(), "ether"),
            seller: item.seller,
            owner: item.owner,
            creator: item.creator,
            royaltyPercentage: metadata.royaltyPercentage,
            quantity: metadata.quantity,
            website: metadata.website,
            collection: metadata.collection,
            tokenURI,
            batchSpecificId: item.batchSpecificId.toString(),
            batchNumber: item.batchNumber.toString(),
            ownedByCurrentUser: item.owner?.toLowerCase() === currentAccount?.toLowerCase(),
            isSeller: item.seller?.toLowerCase() === currentAccount?.toLowerCase(),
            chainId,
            router,
            globalId: `${chainId}:${nftContractAddress}:${item.tokenId.toString()}`,
            listingGlobalId: `${chainId}:${marketplaceAddress}:${item.listingId.toString()}`,
        };
    };




    const fetchMarketsNFTs = async (): Promise<NftData[]> => {
        const allNFTs: NftData[] = [];

        for (const network of getActiveNetworks()) {
            const provider = new ethers.JsonRpcProvider(networkConfig[network]?.rpcUrls[0]);
            const marketplace = fetchContract(provider, network, "marketplace");
            const nft = fetchContract(provider, network, "nft");

            try {
                const rawItems: MarketItem[] = await marketplace.fetchMarketItems();
                if (!rawItems || rawItems.length === 0) {
                    console.warn(`No market items found on ${network}.`);
                    continue;
                }

                const parsed = await Promise.all(
                    rawItems.map(async (item) => {
                        try {
                            const tokenURI = await nft.tokenURI(item.tokenId);
                            return await createNftData(item, tokenURI, network, currentAccount);
                        } catch (e) {
                            console.error(`Failed tokenURI fetch for ${item.tokenId} on ${network}:`, e);
                            return null;
                        }
                    })
                );

                allNFTs.push(...parsed.filter((nft): nft is NftData => nft !== null));
            } catch (e) {
                console.error(`Failed to fetch market NFTs from ${network}:`, e);
            }
        }

        return allNFTs;
    };

    const fetchNFTsByOwner = async (
        type: "fetchItemsListed" | "fetchMyNFTs"
    ): Promise<NftData[]> => {
        if (!currentAccount) {
            console.error("No current account found.");
            return [];
        }

        const allNFTs: NftData[] = [];
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await web3Provider.getSigner();

        for (const network of getActiveNetworks()) {
            try {
                const marketplace = fetchContract(signer, network, "marketplace");
                const nft = fetchContract(signer, network, "nft");

                console.log(`Calling ${type} on:`, marketplace.target);

                const rawItems: MarketItem[] =
                    type === "fetchItemsListed"
                        ? await marketplace.fetchItemsListed()
                        : await marketplace.fetchMyNFTs();

                if (!rawItems || rawItems.length === 0) {
                    console.log(`No NFTs found on ${network}.`);
                    continue;
                }

                const parsed = await Promise.all(
                    rawItems.map(async (item) => {
                        try {
                            const tokenURI = await nft.tokenURI(item.tokenId);
                            return await createNftData(item, tokenURI, network, currentAccount);
                        } catch (e) {
                            console.error(`Metadata error for token ${item.tokenId} on ${network}:`, e);
                            return null;
                        }
                    })
                );

                allNFTs.push(...parsed.filter((nft): nft is NftData => nft !== null));
            } catch (err) {
                console.error(`Failed to fetch NFTs from ${network}:`, err);
            }
        }

        return allNFTs;
    };

    const buyNFT = async (listingId: number, tokenId: number, price: string) => {
        try {
            const contract = await connectToContract(currentNetwork, "marketplace");

            if (!contract) {
                console.error("Failed to connect to the contract.");
                return;
            }

            const formattedPrice = ethers.parseUnits(price, "ether");

            const transaction = await contract.buyItem(listingId, {
                value: formattedPrice,
            });

            await transaction.wait();

            const owner = await contract.getNftOwner(tokenId);
            console.log("New NFT owner is:", owner);

            // router.push("/media");
        } catch (error) {
            console.error("Error while buying NFT:", error);
        }
    };


    // const earnings = await contract.getMarketplaceEarnings();
    // const earningsInEth = ethers.formatUnits(earnings, "ether");


    return (
        <NftContext.Provider value={{
            createNFT,
            fetchNFTsByOwner,
            fetchMarketsNFTs,
            buyNFT
        }}>
            {children}
        </NftContext.Provider>
    );
};

export default NftProvider;