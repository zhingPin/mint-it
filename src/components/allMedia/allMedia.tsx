"use client";
import { NftContext } from "@/providers/nftProvider";
import React, { useContext, useEffect, useState } from "react";
import { NftData } from "../../../types/media-types";
import MediaCard from "../mediaComponent/mediaCard/mediaCard";

interface AllMediaProps {
    query: string
    sort: string
    filter: string
}
const AllMedia: React.FC<AllMediaProps> = ({ query, filter }) => {

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

    // Filter NFTs based on the filter and query from the URL
    const filteredNFTs = nfts.filter((nft) => {
        // Apply filter logic
        if (filter === "all") return true;
        if (filter === "music") return nft.audio || nft.media.fileType?.startsWith("audio/");
        if (filter === "videos") return nft.video || nft.media.fileType?.startsWith("video/");
        if (filter === "images") {
            return (
                (nft.image || nft.media.fileType?.startsWith("image/")) &&
                !nft.video &&
                !nft.audio
            );
        }

        return false;
    }).filter((nft) => {
        // Apply query logic
        if (!query) return true; // If no query, include all
        const lowerCaseQuery = query.toLowerCase();
        return (
            nft.name?.toLowerCase().includes(lowerCaseQuery) || // Check if name matches query
            nft.description?.toLowerCase().includes(lowerCaseQuery) // Check if description matches query
        );
    });

    return (
        <div>
            <MediaCard NftData={filteredNFTs} />
        </div>
    );
};

export default AllMedia;