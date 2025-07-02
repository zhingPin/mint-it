import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface CreateNftInput {
    name: string; // Required field
    description?: string; // Optional description
    image: NftImage
    media?: NftMedia; // Media object (image, video, or audio)
    price?: string; // Price in Ether
    royaltyPercentage?: number; // Optional royalty percentage
    quantity?: number; // Optional quantity
    genre?: string; // Optional genre
    collection?: string; // Optional collection name
    router?: AppRouterInstance,
}

export type NftMedia = NftVideo | NftAudio;


export interface NftVideo {
    fileUrl: string;
    fileType: string;
    fileSize: number,
    resolution?: string; // Optional resolution (e.g., "1920x1080")
    previewUrl?: string; // Optional preview URL for video
    previewDuration?: number; // Optional duration for video preview
    aspectRatio?: string; // e.g., "16:9" or "1:1"
    bitrate?: string; // for audio/video quality
    mimeType?: string; // e.g., "audio/mpeg"
    mediaType?: 'video';

}

export interface NftAudio {
    fileUrl?: string;
    fileType: string;
    fileSize?: number,
    previewUrl?: string; // Optional preview URL for audio
    previewDuration?: number; // Optional duration for audio preview
    aspectRatio?: string; // e.g., "16:9" or "1:1"
    bitrate?: string; // for audio/video quality
    mimeType?: string; // e.g., "audio/mpeg"
    mediaType?: 'audio'

}

export interface NftImage {
    fileUrl: string;
    fileType: string;
    fileSize: number;
    resolution?: string;
}

export interface NftData {
    tokenId: string;
    listingId: string;
    price: string;
    batchSpecificId: string;
    batchNumber: string;
    name: string;
    image: NftImage
    media?: NftMedia, // Type of the NFT
    description?: string;
    seller: string | null; // Seller's address or null if not available
    owner: string;
    creator: string;
    royaltyPercentage?: number;
    quantity?: number;
    website?: string; // Optional field
    collection?: string; // Optional field
    tokenURI?: string;
    metadata?: Record<string, any>; // Additional metadata if needed
    genre?: string; // Optional field for genre
    credits?: string; // Optional field for credits
    chainId: string
    router: AppRouterInstance,
    ownedByCurrentUser?: boolean; // ✅ optional for backward compatibility
    isSeller?: boolean; // ✅ optional for backward compatibility
    globalId: string; // e.g., "137:0xabc...:5"
    listingGlobalId?: string; // optional, same pattern for listings
}

export interface Metadata {
    name: string;
    image: string;
    description: string;
    media?: string;
    video?: string;
    audio?: string;
    royaltyPercentage?: number;
    quantity?: number;
    website?: string;
    collection?: string;
}

export interface MarketItem {
    tokenId: bigint;
    listingId: string,
    seller: string;
    owner: string;
    price: bigint;
    creator: string;
    batchSpecificId: bigint;
    batchNumber: bigint;
}


