"use client";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { NftContext } from "@/providers/nftProvider";
import { WalletContext } from "@/providers/walletProvider";
import MediaCard from "../mediaComponent/mediaCard/mediaCard";
import { NftData } from "../../../types/media-types";

const MyMedia: React.FC = () => {
    const [myNFTs, setMyNFTs] = useState<NftData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const nftContext = useContext(NftContext);
    const walletContext = useContext(WalletContext);
    const searchParams = useSearchParams();

    if (!nftContext || !walletContext) {
        throw new Error("MyMedia must be used within NftProvider and WalletProvider");
    }

    const { fetchNFTsByOwner } = nftContext;
    const { currentAccount } = walletContext;

    const filter = searchParams.get("filter");
    const type = filter === "Listed" ? "fetchItemsListed" : "fetchMyNFTs";

    useEffect(() => {
        const fetchData = async () => {
            if (!currentAccount) return;

            setLoading(true);
            const nfts = await fetchNFTsByOwner(type);
            if (nfts) {
                setMyNFTs(nfts);
            }
            setLoading(false);
        };

        fetchData();
    }, [currentAccount, type, fetchNFTsByOwner]);

    if (loading) return <p>Loading your NFTs...</p>;
    if (myNFTs.length === 0) return <p>You don&apos;t own any NFTs yet.</p>
        ;

    return (
        <div>
            <MediaCard NftData={myNFTs} />
        </div>
    );
};

export default MyMedia;
