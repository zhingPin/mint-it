"use client";
import React, { useEffect, useState } from "react";
import { NftData } from "../../../types/media-types";
import MediaCard from "../mediaComponent/mediaCard/mediaCard";
import { useNftContext } from "@/(context)/useContext/nftContext/useNftContext.ts";
import Error from "next/error";

interface RelatedMediaProps {
    id: string;
}

const RelatedMedia = ({ id }: RelatedMediaProps) => {
    const [relatedMedia, setRelatedMedia] = useState<NftData[]>([]); // State to store related NFTs
    const [loading, setLoading] = useState<boolean>(true);

    const nftContext = useNftContext();



    const { fetchMarketsNFTs } = nftContext;
    const tokenId = Number(id); // Convert tokenId to a number
    console.log(tokenId)
    useEffect(() => {
        fetchMarketsNFTs()
            .then((items: NftData[]) => {
                if (!items || items.length === 0) {
                    console.warn("No NFTs fetched.");
                    setRelatedMedia([]);
                    return;
                }

                // Find the current NFT by tokenId
                const currentNFT = items.find((nft) => Number(nft.tokenId) === tokenId);

                if (!currentNFT) {
                    console.error("NFT with the given tokenId not found.");
                    setRelatedMedia([]);
                    return;
                }

                const batchNumber = currentNFT.batchNumber; // Get the batchNumber of the current NFT

                // Filter NFTs with the same batchNumber, excluding the current NFT
                const filteredMedia = items.filter(
                    (nft) => nft.batchNumber === batchNumber && Number(nft.tokenId) !== tokenId
                );

                setRelatedMedia(filteredMedia);
            })
            .catch((error: Error) => {
                console.error("Error fetching related media:", error);
            })
            .finally(() => {
                setLoading(false); // Set loading to false after fetching
            });
    }, [tokenId, fetchMarketsNFTs]);

    if (loading) {
        return <p>Loading related media...</p>; // Show a loading state
    }

    if (relatedMedia.length === 0) {
        return <p>No related media found.</p>; // Show a message if no related media is found
    }

    return (
        <>
            <MediaCard NftData={relatedMedia} />
        </>

    );
};

export default RelatedMedia;