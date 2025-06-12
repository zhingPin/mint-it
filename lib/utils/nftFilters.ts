import { NftData } from "../../types/media-types"



// Define valid sort options
export type SortOption = "Most Recent" | "High to Low" | "Low to High" | "Old to New"
export type MediaTypeFilter = "all" | "music" | "videos" | "images"

export interface FilterAndSortOptions {
    query?: string
    sort?: string // Accept any string, we'll map it to valid options
    mediaType?: string // Accept any string, we'll map it to valid options
    // Add more filter options as needed
    priceRange?: {
        min?: number
        max?: number
    }
    creator?: string
    collection?: string
}

/**
 * Filters and sorts an array of NFTs based on the provided options
 */
export function filterAndSortNFTs(nfts: NftData[], options: FilterAndSortOptions = {}): NftData[] {
    const { query = "", sort = "Most Recent", mediaType = "all", priceRange, creator, collection } = options

    return nfts
        .filter((nft) => {
            // Apply media type filter
            if (mediaType !== "all") {
                switch (mediaType) {
                    case "music":
                        if (!(nft.audio || nft.media?.fileType?.startsWith("audio/"))) return false
                        break
                    case "videos":
                        if (!(nft.video || nft.media?.fileType?.startsWith("video/"))) return false
                        break
                    case "images":
                        if (nft.media?.fileType) return false // Images don't have media fileType
                        break
                }
            }

            // Apply search query filter
            if (query) {
                const lowerCaseQuery = query.toLowerCase()
                const matchesSearch =
                    nft.name?.toLowerCase().includes(lowerCaseQuery) ||
                    nft.description?.toLowerCase().includes(lowerCaseQuery) ||
                    nft.creator?.toLowerCase().includes(lowerCaseQuery) ||
                    nft.collection?.toLowerCase().includes(lowerCaseQuery)

                if (!matchesSearch) return false
            }

            // Apply price range filter
            if (priceRange) {
                const price = Number.parseFloat(nft.price)
                if (priceRange.min !== undefined && price < priceRange.min) return false
                if (priceRange.max !== undefined && price > priceRange.max) return false
            }

            // Apply creator filter
            if (creator && nft.creator?.toLowerCase() !== creator.toLowerCase()) {
                return false
            }

            // Apply collection filter
            if (collection && nft.collection?.toLowerCase() !== collection.toLowerCase()) {
                return false
            }

            return true
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
}

/**
 * Get unique batch NFTs (first NFT from each batch)
 */
export function getUniqueBatchNFTs(nfts: NftData[]): NftData[] {
    const firstNFTsMap = new Map<number, NftData>()

    // Reverse to get the latest NFT from each batch
    nfts.reverse().forEach((nft) => {
        const batchNumber = nft.batchNumber
        if (!firstNFTsMap.has(batchNumber)) {
            firstNFTsMap.set(batchNumber, nft)
        }
    })

    return Array.from(firstNFTsMap.values())
}

/**
 * Get NFTs from the same batch as a given token ID
 */
export function getRelatedNFTs(nfts: NftData[], tokenId: number): NftData[] {
    const currentNFT = nfts.find((nft) => Number(nft.tokenId) === tokenId)
    if (!currentNFT) return []

    const batchNumber = currentNFT.batchNumber
    return nfts.filter((nft) => nft.batchNumber === batchNumber && Number(nft.tokenId) !== tokenId)
}

/**
 * Get NFTs by ownership status
 */
export function filterByOwnership(nfts: NftData[], type: "owned" | "listed" | "all"): NftData[] {
    switch (type) {
        case "owned":
            return nfts.filter((nft) => nft.ownedByCurrentUser)
        case "listed":
            return nfts.filter((nft) => nft.isSeller)
        case "all":
        default:
            return nfts
    }
}
