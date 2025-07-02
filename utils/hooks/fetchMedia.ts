"use client"
// hooks/useNFTFetcher.ts
import { useNftContext } from "@/(context)/useContext/nftContext/useNftContext.ts";
import { useWalletContext } from "@/(context)/useContext/walletContext/useWalletContext";
import { useEffect, useState } from "react";
import { NftData } from "../../types/media-types";
import { getUniqueBatchNFTs } from "../../lib/utils/nftFilters";


type FetchStrategy =
    | { type: "all" }
    | { type: "related"; tokenId: number }
    | { type: "owned" | "listed" };

export function useNFTFetcher(strategy: FetchStrategy) {
    const { fetchMarketsNFTs, fetchNFTsByOwner } = useNftContext();
    const { currentAccount } = useWalletContext();

    const [nfts, setNfts] = useState<NftData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);

    useEffect(() => {
        setLoading(true);

        const fetch = async () => {
            try {
                if (strategy.type === "all") {
                    const data = await fetchMarketsNFTs();
                    if (!data) throw new Error("No data returned from fetchMarketsNFTs");
                    setNfts(getUniqueBatchNFTs(data));
                } else if (strategy.type === "related") {
                    const all = await fetchMarketsNFTs(); // pass currentAccount
                    if (!all) throw new Error("No data returned from fetchMarketsNFTs");

                    const current = all.find(n => n.tokenId === strategy.tokenId.toString());
                    if (!current) throw new Error("NFT not found");

                    const related = all.filter(
                        n =>
                            n.batchNumber === current.batchNumber &&
                            n.tokenId !== strategy.tokenId.toString()
                    );
                    setNfts(related);
                }
                else if (strategy.type === "owned" || strategy.type === "listed") {
                    if (!currentAccount) {
                        setNfts([]);
                        return;
                    }
                    const key = strategy.type === "owned" ? "fetchMyNFTs" : "fetchItemsListed";
                    const data = await fetchNFTsByOwner(key);
                    if (!data) throw new Error("No data returned from fetchNFTsByOwner");
                    setNfts(getUniqueBatchNFTs(data));
                }
            } catch (err: any) {
                console.error("NFT fetch failed:", err);
                setError(err.message);
                setNfts([]);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [strategy, fetchMarketsNFTs, fetchNFTsByOwner, currentAccount]);

    return { nfts, loading, error, currentAccount };
}

