"use client"
import { NftContext } from "@/(context)/providers/nftProvider"
import type React from "react"
import { useContext, useEffect, useState } from "react"
import type { NftData } from "../../../../types/media-types"
import MediaCard from "../mediaCard/mediaCard"

type FilterMode = "all" | "unique-batches" | "same-batch" | "owned" | "listed"
type MediaType = "all" | "music" | "videos" | "images"
type DataSource = "marketplace" | "user-owned" | "user-listed"

interface MediaListProps {
    // Data source
    dataSource?: DataSource

    // Filtering options
    query?: string
    sort?: string
    filter?: string
    mediaType?: MediaType
    filterMode?: FilterMode

    // For related media functionality
    currentTokenId?: number

    // Display options
    showLoading?: boolean
    emptyMessage?: string
    loadingMessage?: string

    // Limit results
    limit?: number
}

const MediaList: React.FC<MediaListProps> = ({
    dataSource = "marketplace",
    query = "",
    sort = "newest",
    mediaType = "all",
    filterMode = "all",
    currentTokenId,
    showLoading = true,
    emptyMessage = "No media found.",
    loadingMessage = "Loading media...",
    limit,
}) => {
    const nftContext = useContext(NftContext)
    const [nfts, setNfts] = useState<NftData[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    if (!nftContext) {
        throw new Error("MediaList must be used within NftProvider")
    }

    const { fetchMarketsNFTs, fetchNFTsByOwner } = nftContext

    useEffect(() => {
        setLoading(true)

        // Choose the appropriate fetch function based on dataSource
        const fetchData = async () => {
            switch (dataSource) {
                case "user-owned":
                    return await fetchNFTsByOwner("fetchMyNFTs")
                case "user-listed":
                    return await fetchNFTsByOwner("fetchItemsListed")
                case "marketplace":
                default:
                    return await fetchMarketsNFTs()
            }
        }

        fetchData()
            .then((items) => {
                if (!items || items.length === 0) {
                    console.warn("No NFTs fetched.")
                    setNfts([])
                    return
                }

                let processedNFTs = [...items]

                // Apply different filtering modes
                switch (filterMode) {
                    case "unique-batches":
                        // Show only the first NFT from each batch (AllMedia logic)
                        const firstNFTsMap = new Map()
                        processedNFTs.reverse().forEach((nft) => {
                            const batchNumber = nft.batchNumber
                            if (!firstNFTsMap.has(batchNumber)) {
                                firstNFTsMap.set(batchNumber, nft)
                            }
                        })
                        processedNFTs = Array.from(firstNFTsMap.values())
                        break

                    case "same-batch":
                        // Show NFTs from the same batch as current NFT (RelatedMedia logic)
                        if (currentTokenId) {
                            const currentNFT = items.find((nft) => Number(nft.tokenId) === currentTokenId)
                            if (currentNFT) {
                                const batchNumber = currentNFT.batchNumber
                                processedNFTs = items.filter(
                                    (nft) => nft.batchNumber === batchNumber && Number(nft.tokenId) !== currentTokenId,
                                )
                            } else {
                                processedNFTs = []
                            }
                        } else {
                            processedNFTs = []
                        }
                        break

                    case "owned":
                        // Filter for owned NFTs (useful when dataSource is "marketplace")
                        processedNFTs = items.filter((nft) => nft.ownedByCurrentUser)
                        break

                    case "listed":
                        // Filter for listed NFTs (useful when dataSource is "marketplace")
                        processedNFTs = items.filter((nft) => nft.isSeller)
                        break

                    case "all":
                    default:
                        // No special filtering, use all items
                        break
                }

                // Apply media type filtering
                if (mediaType !== "all") {
                    processedNFTs = processedNFTs.filter((nft) => {
                        switch (mediaType) {
                            case "music":
                                return nft.media && nft.media.fileType?.startsWith("audio/")
                            case "videos":
                                return nft.media && nft.media.fileType?.startsWith("video/")
                            case "images":
                                return !nft.media && !nft.video && !nft.audio
                            default:
                                return true
                        }
                    })
                }

                // Apply search query filtering
                if (query) {
                    const lowerCaseQuery = query.toLowerCase()
                    processedNFTs = processedNFTs.filter((nft) => {
                        return (
                            nft.name?.toLowerCase().includes(lowerCaseQuery) ||
                            nft.description?.toLowerCase().includes(lowerCaseQuery) ||
                            nft.creator?.toLowerCase().includes(lowerCaseQuery) ||
                            nft.collection?.toLowerCase().includes(lowerCaseQuery)
                        )
                    })
                }

                // Apply sorting
                switch (sort) {
                    case "High to Low":
                    case "price-high":
                        processedNFTs.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
                        break
                    case "Low to High":
                    case "price-low":
                        processedNFTs.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
                        break
                    case "Old to New":
                    case "oldest":
                        processedNFTs.sort((a, b) => Number(a.tokenId) - Number(b.tokenId))
                        break
                    case "Most Recent":
                    case "newest":
                    default:
                        processedNFTs.sort((a, b) => Number(b.tokenId) - Number(a.tokenId))
                        break
                }

                // Apply limit if specified
                if (limit && limit > 0) {
                    processedNFTs = processedNFTs.slice(0, limit)
                }

                setNfts(processedNFTs)
            })
            .catch((error) => {
                console.error("Error fetching NFTs:", error)
                setNfts([])
            })
            .finally(() => {
                setLoading(false)
            })
    }, [
        currentTokenId, dataSource, fetchMarketsNFTs, fetchNFTsByOwner, filterMode, limit, mediaType, query, sort

    ])

    if (loading && showLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">{loadingMessage}</span>
            </div>
        )
    }

    if (nfts.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">{emptyMessage}</p>
                {query && <p className="text-sm text-gray-400 mt-2">Try adjusting your search terms or filters</p>}
            </div>
        )
    }

    return (
        <div>
            {/* Optional: Show results count */}
            <div className="mb-4 text-sm text-gray-600">
                {nfts.length} {nfts.length === 1 ? "item" : "items"} found
                {query && ` for "${query}"`}
            </div>
            <MediaCard NftData={nfts} />
        </div>
    )
}

export default MediaList
