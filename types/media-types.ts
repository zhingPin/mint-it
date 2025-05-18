import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Router } from "next/router";

export interface CreateNftInput {
    name?: string; // Required field
    description?: string; // Optional description
    // image: string,
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
    fileUrl?: string;
    fileType?: string;
    fileSize?: string,
    resolution?: string; // Optional resolution (e.g., "1920x1080")
}

export interface NftAudio {
    fileUrl?: string;
    fileType?: string;
    fileSize?: string,
}

export interface NftImage {
    fileUrl: string;
    fileType: string;
    fileSize?: string;
    resolution?: string;
}

export interface NftData {
    tokenId?: number;
    name: string;
    image: NftImage
    media: NftMedia, // Type of the NFT
    description?: string;
    video?: string; // Optional field
    audio?: string; // Optional field
    price: string; // Price in Ether
    seller: string | null; // Seller's address or null if not available
    owner?: string;
    creator?: string;
    royaltyPercentage?: number;
    quantity?: number;
    website?: string; // Optional field
    collection?: string; // Optional field
    tokenURI?: string;
    batchSpecificId?: number;
    batchNumber?: number;
    metadata?: Record<string, any>; // Additional metadata if needed
    genre?: string; // Optional field for genre
    credits?: string; // Optional field for credits
    chainId?: string
    router: AppRouterInstance,
}



// interface NftData2 {
//     tokenId: number; // Required field
//     name: string; // Required field
//     description?: string;
//     media: Media2; // Consolidated media field
//     price: string; // Price in Ether
//     seller?: string; // Seller's address
//     owner?: string; // Owner's address
//     creator?: string; // Creator's address
//     royaltyPercentage?: number;
//     quantity?: number;
//     collection?: string;
//     batchNumber?: number;
//     metadata?: Record<string, any>; // Additional metadata
//     chainId?: string; // Blockchain network ID
// }

// export type Media2 = Video2 | Audio2;

// interface Image2 {
//     fileUrl?: string;
//     fileType?: "image/jpg" | "image/jpeg" | "image/png" | "image/gif" | "image/bmp" | "image/tiff" | "image/webp" | "image/svg+xml" | "image/heic" | "image/raw";
//     fileSize?: string;
//     resolution?: string;
// }

// interface Video2 {
//     fileUrl?: string;
//     fileType?: "video/mp4" | "video/webm" | "video/ogg" | "video/avi" | "video/mov" | "video/wmv" | "video/flv" | "video/mkv" | "video/mpeg" | "video/mpg" | "video/3gp" | "video/3g2";
//     fileSize?: string;
//     url: string;
//     resolution?: string;
// }

// interface Audio2 {
//     fileUrl?: string;
//     fileType?: "audio/mp3" | "audio/wav" | "audio/ogg" | "audio/aac" | "audio/flac" | "audio/m4a" | "audio/wma" | "audio/opus" | "audio/alac" | "audio/dsd" | "audio/aiff";
//     fileSize?: string;
//     url: string;
//     bitrate?: string;
// }


