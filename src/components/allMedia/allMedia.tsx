"use client";
import { NftContext } from "@/providers/nftProvider";
import React, { useContext, useEffect, useState } from "react";
import { NftData } from "../../../types/media-types";
import MediaCard from "../mediaComponent/mediaCard/mediaCard";
import { filterAndSortNFTs, getUniqueBatchNFTs, MediaTypeFilter } from "../../../lib/utils/nftFilters";

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
                // Get unique batch NFTs
                const uniqueNFTs = getUniqueBatchNFTs(items)
                setNfts(uniqueNFTs)
            })
            .catch((error) => {
                console.error("Error fetching NFTs:", error);
            });
    }, [fetchMarketsNFTs]);

    // Apply filtering and sorting using the utility function
    const processedNFTs = filterAndSortNFTs(nfts, {
        query,
        sort: sort as any, // Type assertion for now
        mediaType: filter as MediaTypeFilter,
    })

    return (
        <div>
            <MediaCard NftData={processedNFTs} />
        </div>
    );
};

export default AllMedia;