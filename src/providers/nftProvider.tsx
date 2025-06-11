"use client";
import axios from "axios";
import React, { ReactNode, useContext } from "react";
import { NftContextProps } from "./context/nftContext";
import { WalletContext } from "./walletProvider";
import { IpfsContext } from "./ipfsProvider";
import { networkInfo } from "@/lib/chains/networkInfo";
import { connectToContract, fetchContract } from "./context/helpers/walletHelpers/connectingContracts";
import { networkConfig } from "@/lib/chains/networkConfig";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { CreateNftInput, MarketItem, NftData } from "../../types/media-types";




export const NftContext = React.createContext<NftContextProps | undefined>(undefined);

const NftProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

    //--- createSale FUNCTION
    const createSale = async (
        url: string,
        formInputPrice: string,
        royaltyPercentage: number,
        quantity: number,
        isReselling: boolean = false,
        id: number = 0
    ): Promise<void> => {
        try {
            console.log("Create sale URL:", url);
            const price = ethers.parseUnits(formInputPrice, "ether");

            const contract = await connectToContract(currentNetwork, "marketplace");
            if (!contract) {
                console.error("Failed to connect to the contract.");
                return;
            }

            const [listingPrice] = await contract.getFees(); // assume listingPrice is a BigInt

            let transaction;
            if (!isReselling) {
                const totalListingFee = listingPrice * BigInt(quantity);
                transaction = await contract.mintAndList(
                    url,
                    price,
                    royaltyPercentage,
                    quantity,
                    {
                        value: totalListingFee,
                    }
                );
            } else {
                transaction = await contract.listItem(id, price, {
                    value: listingPrice,
                });
            }

            await transaction.wait();
            console.log("Transaction Hash:", transaction.hash);
        } catch (error) {
            console.error("Error while creating sale:", error);
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



    const fetchMarketsNFTs = async (): Promise<NftData[]> => {
        try {
            const allNetworks = Object.keys(networkInfo).filter(
                (network) =>
                    networkInfo[network].active &&
                    networkInfo[network].contracts.marketplace &&
                    networkInfo[network].contracts.nft // ✅ NFT contract must exist
            );

            const allNFTs: NftData[] = [];

            for (const network of allNetworks) {
                const provider = new ethers.JsonRpcProvider(
                    networkConfig[network]?.rpcUrls[0]
                );
                // console.log(`Fetching NFTs from network: ${network}`);

                const marketplaceContract = fetchContract(provider, network, "marketplace");
                const nftContract = fetchContract(provider, network, "nft"); // ✅ NFT contract instance

                try {
                    const data = await marketplaceContract.fetchMarketItems();
                    console.log(`Fetched Market Items from ${network}:`, data);

                    if (!data || data.length === 0) {
                        console.warn(`No market items found on ${network}.`);
                        continue;
                    }

                    const items: NftData[] = await Promise.all(
                        data.map(
                            async ({
                                tokenId,
                                listingId,
                                seller,
                                owner,
                                price: unformattedPrice,
                                creator,
                                batchSpecificId,
                                batchNumber,
                            }: MarketItem) => {
                                try {
                                    // ✅ Call tokenURI on the NFT contract, not marketplace
                                    const tokenURI = await nftContract.tokenURI(tokenId);
                                    // console.log(
                                    //     `Token URI for Token ID ${tokenId} on ${network}:`,
                                    //     tokenURI
                                    // );

                                    const {
                                        data: {
                                            name,
                                            image,
                                            media,
                                            description,
                                            video,
                                            audio,
                                            royaltyPercentage,
                                            quantity,
                                            website,
                                            collection,
                                            chainId
                                        },
                                    } = await axios.get(tokenURI);

                                    const price = ethers.formatUnits(
                                        unformattedPrice.toString(),
                                        "ether"
                                    );
                                    const ownedByCurrentUser = (owner?.toLowerCase() === currentAccount?.toLowerCase());
                                    const isSeller = (seller?.toLowerCase() === currentAccount?.toLowerCase());


                                    return {
                                        tokenId,
                                        listingId,
                                        name,
                                        description,
                                        image,
                                        media,
                                        video,
                                        audio,
                                        price,
                                        seller,
                                        owner,
                                        creator,
                                        royaltyPercentage,
                                        quantity,
                                        website,
                                        collection,
                                        tokenURI,
                                        batchSpecificId: Number(batchSpecificId),
                                        batchNumber: Number(batchNumber),
                                        network,
                                        ownedByCurrentUser,
                                        isSeller,
                                        chainId
                                    };
                                } catch (metadataError) {
                                    console.error(
                                        `Error fetching metadata for token ${tokenId} on ${network}:`,
                                        metadataError
                                    );
                                    return null;
                                }
                            }
                        )
                    );

                    allNFTs.push(...items.filter((item): item is NftData => item !== null));
                } catch (networkError) {
                    console.error(`Error fetching NFTs from ${network}:`, networkError);
                }
            }

            return allNFTs;
        } catch (error) {
            console.error("Error while fetching NFTs from all networks:", error);
            return [];
        }
    };



    function isNftData(item: NftData | null): item is NftData {
        return item !== null;
    }

    const fetchNFTsByOwner = async (
        type: "fetchItemsListed" | "fetchMyNFTs"
    ): Promise<NftData[]> => {
        if (!currentAccount) {
            console.error("No current account found.");
            return [];
        }

        console.log("Current account:", currentAccount);
        const allNFTs: NftData[] = [];

        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await web3Provider.getSigner();

        for (const network of getActiveNetworks()) {
            try {
                const marketplace = fetchContract(signer, network, "marketplace");
                const nft = fetchContract(signer, network, "nft");

                console.log(`Calling ${type} on:`, marketplace.target);

                let rawItems: MarketItem[];

                try {
                    rawItems = type === "fetchItemsListed"
                        ? await marketplace.fetchItemsListed()
                        : await marketplace.fetchMyNFTs();
                } catch {
                    console.warn(`No NFTs returned from ${type} on ${network}. Skipping...`);
                    continue;
                }

                if (!rawItems || rawItems.length === 0) {
                    console.log(`No NFTs found on ${network}.`);
                    continue;
                }

                const parsedItems = await Promise.all(
                    rawItems.map(async (item) => {
                        try {
                            const tokenURI = await nft.tokenURI(item.tokenId);
                            console.log(`Token URI for token ${item.tokenId} on ${network}:`, tokenURI);

                            const { data } = await axios.get(tokenURI);
                            const ownedByCurrentUser = item.owner?.toLowerCase() === currentAccount.toLowerCase();
                            const isSeller = item.seller?.toLowerCase() === currentAccount.toLowerCase();


                            return {
                                tokenId: Number(item.tokenId),
                                listingId: Number(item.listingId),
                                name: data.name,
                                description: data.description,
                                image: data.image,
                                media: data.media,
                                video: data.video,
                                audio: data.audio,
                                price: ethers.formatUnits(item.price.toString(), "ether"),
                                seller: item.seller,
                                owner: item.owner,
                                creator: item.creator,
                                royaltyPercentage: data.royaltyPercentage,
                                quantity: data.quantity,
                                website: data.website,
                                collection: data.collection,
                                tokenURI,
                                batchSpecificId: Number(item.batchSpecificId),
                                batchNumber: Number(item.batchNumber),
                                network,
                                router,
                                ownedByCurrentUser,
                                isSeller,
                                chainId: data.chainId,
                            } as NftData;
                        } catch (metaErr) {
                            console.error(`Metadata error for token ${item.tokenId} on ${network}:`, metaErr);
                            return null;
                        }
                    })
                );

                allNFTs.push(...parsedItems.filter(isNftData));
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