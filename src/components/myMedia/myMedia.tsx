"use client"
import type React from "react"
import { useContext, useEffect, useState } from "react"
import { NftContext } from "@/providers/nftProvider"
import { WalletContext } from "@/providers/walletProvider"
import MediaCard from "../mediaComponent/mediaCard/mediaCard"
import type { NftData } from "../../../types/media-types"

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

                // Create a map to store the first NFT for each batchNumber
                const firstNFTsMap = new Map()
                // Iterate through the fetched NFTs (reverse to get latest first)
                items.reverse().forEach((nft) => {
                    const batchNumber = nft.batchNumber

                    // If the batchNumber is not in the map, add the NFT to the map
                    if (!firstNFTsMap.has(batchNumber)) {
                        firstNFTsMap.set(batchNumber, nft)
                    }
                })

                // Convert the map values back to an array
                const firstNFTs = Array.from(firstNFTsMap.values())
                setMyNFTs(firstNFTs)
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
    const processedNFTs = myNFTs
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
                <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
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
