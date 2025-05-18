"use client";
import axios from "axios";
import React, { useState, ReactNode, useContext, useEffect } from "react";
import { NftContextProps } from "./context/nftContext";
import { WalletContext } from "./walletProvider";
import { create } from "ipfs-http-client";
import { IpfsContext, useIpfs } from "./ipfsProvider";
import { networkInfo } from "@/lib/chains/networkInfo";
import { connectToContract, fetchContract } from "./context/helpers/walletHelpers/connectingContracts";
import { networkConfig } from "@/lib/chains/networkConfig";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { CreateNftInput, NftData } from "../../types/media-types";
import { Router } from "next/router";




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
    const { uploadToIpfs, client } = ipfsContext;


    const { currentAccount, currentNetwork } = walletContext

    const networkContract = networkInfo[currentNetwork]?.contractAddress;

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
            router,
        } = nftData;

        if (!name || !price || !image) {
            console.error("Data is missing.");
            return;
        }
        const chainId = currentNetwork

        const data = JSON.stringify({
            name,
            price,
            image,
            description,
            media,
            royaltyPercentage,
            quantity,
            collection,
            chainId

        });

        try {
            if (!client) {
                console.error("IPFS client is not initialized.");
                return;
            }

            const added = await client.add(data);
            const url = `${process.env.NEXT_PUBLIC_SUBDOMAIN}/ipfs/${added.path}`;

            await createSale(url, price, royaltyPercentage || 0, quantity || 1);
            // router.push("/");
            console.log("NFT created successfully. URL:", url);
            console.log("Data:", data);
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

            const contract = await connectToContract(
                currentNetwork
            );
            if (!contract) {
                console.error("Failed to connect to the contract.");
                return;
            }
            const [listingPrice] = await contract.getFees();

            const transaction = !isReselling
                ? await contract.createToken(url, price, royaltyPercentage, quantity, {
                    value: ethers.parseUnits((listingPrice * BigInt(quantity)).toString(), "wei"),
                })
                : await contract.resellToken(id, price, {
                    value: ethers.parseUnits(listingPrice.toString(), "wei"),
                });

            await transaction.wait();
            console.log("Transaction Hash:", transaction.hash);
        } catch (error) {
            console.error("Error while creating sale:", error);
        }
    };

    const fetchMarketsNFTs = async (): Promise<NftData[]> => {
        try {
            const allNetworks = Object.keys(networkInfo).filter(
                (network) =>
                    networkInfo[network].active && networkInfo[network].contractAddress
            );

            const allNFTs: NftData[] = [];

            for (const network of allNetworks) {
                const provider = new ethers.JsonRpcProvider(
                    networkConfig[network]?.rpcUrls[0]
                );
                console.log(`Fetching NFTs from network: ${network}`);
                console.log("Using RPC URL:", networkConfig[network]?.rpcUrls[0]);

                const contract = fetchContract(provider, network);
                console.log("Contract Address:", networkInfo[network]?.contractAddress);

                try {
                    const data = await contract.fetchMarketItems();
                    console.log(`Fetched Market Items from ${network}:`, data);

                    if (!data || data.length === 0) {
                        console.warn(`No market items found on ${network}.`);
                        continue;
                    }

                    const items: NftData[] = await Promise.all(
                        data.map(
                            async ({
                                tokenId,
                                seller,
                                owner,
                                price: unformattedPrice,
                                creator,
                                batchSpecificId,
                                batchNumber,
                            }: any) => {
                                try {
                                    const tokenURI = await contract.tokenURI(tokenId);
                                    console.log(
                                        `Token URI for Token ID ${tokenId} on ${network}:`,
                                        tokenURI
                                    );

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
                                        },
                                    } = await axios.get(tokenURI);

                                    const price = ethers.formatUnits(
                                        unformattedPrice.toString(),
                                        "ether"
                                    );

                                    return {
                                        tokenId: tokenId,
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
                                        network, // Include the network name for reference
                                    };
                                } catch (metadataError) {
                                    console.error(
                                        `Error fetching metadata for token ${tokenId} on ${network}:`,
                                        metadataError
                                    );
                                    return null; // Skip this token if metadata fetch fails
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


    const fetchNFTsByOwner = async (type: string): Promise<NftData[] | undefined> => {
        if (!currentAccount) {
            console.error("No current account found.");
            return undefined;
        }
        try {
            const provider = new ethers.JsonRpcProvider(
                networkConfig[currentNetwork]?.rpcUrls[0]);

            const contract = fetchContract(provider, currentNetwork);
            const data =
                type === "fetchItemsListed"
                    ? await contract.fetchItemsListed()
                    : await contract.fetchMyNFTs();

            const items: NftData[] = await Promise.all(
                data.map(
                    async ({
                        tokenId,
                        seller,
                        owner,
                        price: unformattedPrice,
                        creator,
                        batchSpecificId,
                        batchNumber,
                    }: any) => {
                        const tokenURI = await contract.tokenURI(tokenId);
                        const {
                            data: { name, image, description, video, audio },
                        } = await axios.get(tokenURI);

                        const price = ethers.formatUnits(
                            unformattedPrice.toString(),
                            "ether"
                        );

                        return {
                            tokenId: Number(tokenId),
                            name,
                            description,
                            image,
                            video,
                            audio,
                            price,
                            seller,
                            owner,
                            creator,
                            royaltyPercentage: 0, // Default value if not provided
                            quantity: 1, // Default value if not provided
                            website: undefined, // Optional field
                            collection: undefined, // Optional field
                            tokenURI,
                            batchSpecificId: Number(batchSpecificId),
                            batchNumber: Number(batchNumber),
                        };
                    }
                )
            );

            return items;
        } catch (error) {
            console.error("Error while fetching NFTs by owner:", error);
            return undefined;
        }
    };

    //---BUY NFTs FUNCTION
    const buyNFT = async (tokenId: number, price: string) => {
        try {
            const contract = await connectToContract(currentNetwork);

            if (!contract) {
                console.error("Failed to connect to the contract.");
                return; // Exit early if the contract is undefined
            }

            const formattedPrice = ethers.parseUnits(price, "ether");

            const transaction = await contract.createMarketSale(tokenId, {
                value: formattedPrice,
            });

            await transaction.wait();
            router.push("/media");
        } catch (error) {
            console.error("Error while buying NFT:", error);
            // Optionally, handle the error (e.g., show a notification to the user)
        }
    };


    return (
        <NftContext.Provider value={{
            // loading,
            // setLoading,
            // error,
            // setError,
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