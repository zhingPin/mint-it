"use client"
import type React from "react"
import { useContext, useEffect, useState } from "react"
import { NftContext } from "@/providers/nftProvider"
import { WalletContext } from "@/providers/walletProvider"
import MediaCard from "../mediaComponent/mediaCard/mediaCard"
import type { NftData } from "../../../types/media-types"
import { filterAndSortNFTs, getUniqueBatchNFTs, MediaTypeFilter } from "../../../lib/utils/nftFilters"

interface MyMediaProps {
    query: string
    sort: string
    filter: string
    tabopt: string
}

type FetchType = "fetchMyNFTs" | "fetchItemsListed"

const MyMedia: React.FC<MyMediaProps> = ({ query, sort, filter, tabopt }) => {
    const [myNFTs, setMyNFTs] = useState<NftData[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const nftContext = useContext(NftContext)
    const walletContext = useContext(WalletContext)

    if (!nftContext || !walletContext) {
        throw new Error("MyMedia must be used within NftProvider and WalletProvider")
    }

    const { fetchNFTsByOwner } = nftContext
    const { currentAccount } = walletContext

    useEffect(() => {
        if (!currentAccount) {
            setLoading(false)
            return
        }

        setLoading(true)

        let type: FetchType

        if (tabopt === "Owned") {
            type = "fetchMyNFTs"
        } else {
            type = "fetchItemsListed"
        }

        fetchNFTsByOwner(type)
            .then((items) => {
                if (!items || items.length === 0) {
                    console.warn("No NFTs fetched.")
                    setMyNFTs([])
                    return
                }

                // Get unique batch NFTs
                const uniqueNFTs = getUniqueBatchNFTs(items)
                setMyNFTs(uniqueNFTs)
            })
            .catch((error) => {
                console.error("Error fetching NFTs:", error)
                setMyNFTs([])
            })
            .finally(() => {
                setLoading(false)
            })
    }, [tabopt, currentAccount, fetchNFTsByOwner])

    // Apply filtering and sorting
    // Apply filtering and sorting using the utility function
    const processedNFTs = filterAndSortNFTs(myNFTs, {
        query,
        sort: sort as any, // Type assertion for now
        mediaType: filter as MediaTypeFilter,
    })
    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Loading your NFTs...</span>
            </div>
        )
    }

    if (!currentAccount) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Please connect your wallet to view your NFTs.</p>
            </div>
        )
    }

    if (myNFTs.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">
                    {tabopt === "Owned" ? "You don't own any NFTs yet." : "You haven't listed any NFTs yet."}
                </p>
            </div>
        )
    }

    if (processedNFTs.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No NFTs found matching your search criteria.</p>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-4 text-sm text-gray-600">
                {processedNFTs.length} {processedNFTs.length === 1 ? "item" : "items"} found
                {query && ` for "${query}"`}
            </div>
            <MediaCard NftData={processedNFTs} />
        </div>
    )
}

export default MyMedia
