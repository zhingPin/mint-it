"use client";
import React, { useContext, useEffect, useState } from "react";
import { NftContext } from "@/providers/nftProvider";
import { WalletContext } from "@/providers/walletProvider";
import MediaCard from "../mediaComponent/mediaCard/mediaCard";
import { NftData } from "../../../types/media-types";


interface MyMediaProps {
    query: string
    sort: string
    filter: string
    tabopt: string
}

type FetchType = "fetchMyNFTs" | "fetchItemsListed" | "fetchFavoritedNFTs";


const MyMedia: React.FC<MyMediaProps> = ({ query,
    sort,
    filter,
    tabopt }) => {
    const [myNFTs, setMyNFTs] = useState<NftData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const nftContext = useContext(NftContext);
    const walletContext = useContext(WalletContext);

    if (!nftContext || !walletContext) {
        throw new Error("MyMedia must be used within NftProvider and WalletProvider");
    }

    const { fetchNFTsByOwner } = nftContext;
    const { currentAccount } = walletContext;

    let type: FetchType;


    if (tabopt === "Listed") {
        type = "fetchItemsListed";
    } else if (tabopt === "Owned") {
        type = "fetchMyNFTs";
    } else {
        type = "fetchItemsListed";
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!currentAccount) return;

            setLoading(true);
            const nfts = await fetchNFTsByOwner(type);
            if (!nfts) {
                setMyNFTs([]);
                setLoading(false);
                return;
            }


            const sortedNFTs = [...nfts];

            if (sort === "Most Recent") {
                sortedNFTs.reverse();
            } else if (sort === "Price: High to Low") {
                sortedNFTs.sort((a, b) => {
                    const priceA = typeof a.price === "string" ? parseFloat(a.price) : Number(a.price) || 0;
                    const priceB = typeof b.price === "string" ? parseFloat(b.price) : Number(b.price) || 0;
                    return priceB - priceA;
                });
            } else if (sort === "Price: Low to High") {
                sortedNFTs.sort((a, b) => {
                    const priceA = typeof a.price === "string" ? parseFloat(a.price) : Number(a.price) || 0;
                    const priceB = typeof b.price === "string" ? parseFloat(b.price) : Number(b.price) || 0;
                    return priceA - priceB;
                });
            }


            setMyNFTs(sortedNFTs);
            setLoading(false);
        };

        fetchData();
    }, [currentAccount, type, fetchNFTsByOwner, sort]);

    if (loading) return <p>Loading your NFTs...</p>;
    if (myNFTs.length === 0) return <p>You don&apos;t own any NFTs yet.</p>
        ;

    const filteredNFTs = myNFTs.filter((nft) => {
        if (filter === "all") return true;
        if (filter === "music") return nft.audio || nft.media?.fileType?.startsWith("audio/");
        if (filter === "videos") return nft.video || nft.media?.fileType?.startsWith("video/");
        if (filter === "images") return !nft.media?.fileType;

        return false;
    }).filter((nft) => {
        if (!query) return true;
        const lowerCaseQuery = query.toLowerCase();
        return (
            nft.name?.toLowerCase().includes(lowerCaseQuery) ||
            nft.description?.toLowerCase().includes(lowerCaseQuery)
        );
    });

    return (
        <div>
            <MediaCard NftData={filteredNFTs} />
        </div>
    );
};

export default MyMedia;