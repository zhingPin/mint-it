"use client";
import { NftContext } from "@/providers/nftProvider";
import React, { useContext, useEffect, useState } from "react";
import { NftData } from "../../../types/media-types";
import MediaCard from "../mediaComponent/mediaCard/mediaCard";

interface AllMediaProps {
    query: string
    sort: string
    filter: string
    tabopt: string
}
const AllMedia: React.FC<AllMediaProps> = ({ query, filter, sort }) => {

    const nftContext = useContext(NftContext);

    if (!nftContext) {
        throw new Error("AllMedia must be used within NftProvider");
    }

    const { fetchMarketsNFTs } = nftContext;

    const [nfts, setNfts] = useState<NftData[]>([]);


    useEffect(() => {
        fetchMarketsNFTs()
            .then((items) => {
                if (!items || items.length === 0) {
                    console.warn("No NFTs fetched.");
                    setNfts([]);
                    return;
                }

                // Create a map to store the first NFT for each batchNumber
                const firstNFTsMap = new Map();

                // Iterate through the fetched NFTs
                items.reverse().forEach((nft) => {
                    const batchNumber = nft.batchNumber;

                    // If the batchNumber is not in the map, add the NFT to the map
                    if (!firstNFTsMap.has(batchNumber)) {
                        firstNFTsMap.set(batchNumber, nft);
                    }
                });

                // Convert the map values back to an array
                const firstNFTs = Array.from(firstNFTsMap.values());

                setNfts(firstNFTs);
            })
            .catch((error) => {
                console.error("Error fetching NFTs:", error);
            });
    }, [fetchMarketsNFTs]);

    const processedNFTs = nfts
        .filter((nft) => {
            // Apply media type filter
            if (filter === "all") return true
            if (filter === "music") return nft.audio || nft.media?.fileType?.startsWith("audio/")
            if (filter === "videos") return nft.video || nft.media?.fileType?.startsWith("video/")
            if (filter === "images") return !nft.media?.fileType
            return false
        })
        .filter((nft) => {
            // Apply search query filter
            if (!query) return true
            const lowerCaseQuery = query.toLowerCase()
            return nft.name?.toLowerCase().includes(lowerCaseQuery) || nft.description?.toLowerCase().includes(lowerCaseQuery)
        })
        .sort((a, b) => {
            // Apply sorting
            switch (sort) {
                case "Most Recent":
                    return Number(b.tokenId) - Number(a.tokenId) // Newest first
                case "High to Low":
                    return Number.parseFloat(b.price) - Number.parseFloat(a.price)
                case "Low to High":
                    return Number.parseFloat(a.price) - Number.parseFloat(b.price)
                case "Old to New":
                    return Number(a.tokenId) - Number(b.tokenId) // Oldest first
                default:
                    return 0
            }
        })

    return (
        <div>
            <MediaCard NftData={processedNFTs} />
        </div>
    );
};

export default AllMedia;