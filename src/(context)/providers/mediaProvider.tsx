"use client"
import { createContext, useState } from "react";
import { NftImage, NftMedia } from "../../../types/media-types";

interface MediaData {
    // image: string;
    image: NftImage; // Cover image
    media?: NftMedia; // Video or audio
}

interface MediaContextType {
    mediaData: MediaData;
    setImageData: (data: NftImage) => void;
    setMediaData: (data: NftMedia) => void;
}

export const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mediaData, setMediaDataState] = useState<MediaData>({
        // image: "",
        image: { fileUrl: "", fileType: "", fileSize: "" },
        media: undefined,
    });
    const setImageData = (data: NftImage) => {
        setMediaDataState((prev) => ({ ...prev, image: data }));
    };

    const setMediaData = (data: NftMedia) => {
        setMediaDataState((prev) => ({ ...prev, media: data }));
    };

    return (
        <MediaContext.Provider value={{ mediaData, setImageData, setMediaData }}>
            {children}
        </MediaContext.Provider>
    );
};