"use client";
import React, { useEffect, useState } from "react";
import { NftData } from "../../../types/media-types";
import MediaCard from "../mediaComponent/mediaCard/mediaCard";
import { filterAndSortNFTs, getUniqueBatchNFTs } from "../../../lib/utils/nftFilters";
import { useNftContext } from "@/(context)/useContext/nftContext/useNftContext.ts"
import Error from "next/error";

interface AllMediaProps {
    query: string
    sort: string
    filter: string
    tabopt: string
}
const AllMedia: React.FC<AllMediaProps> = ({ query, filter, sort }) => {


    const { fetchMarketsNFTs } = useNftContext();

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
            .catch((error: Error) => {
                console.error("Error fetching NFTs:", error);
            });
    }, [fetchMarketsNFTs]);

    // Apply filtering and sorting using the utility function
    const processedNFTs = filterAndSortNFTs(nfts, {
        query,
        sort: sort, // Type assertion for now
        mediaType: filter,
    })

    return (
        <div>
            <MediaCard NftData={processedNFTs} />
        </div>
    );
};

export default AllMedia;