"use client";
import React, { useState } from "react";
import styles from "./mediaDisplay.module.css";
import { NftImage, NftMedia } from "../../../../../types/media-types";
import Image from "next/image";

export interface MediaData {
    image: NftImage;
    media?: NftMedia;
}

interface MediaDisplayProps {
    mediaData: MediaData;
}

export default function MediaDisplay({ mediaData }: MediaDisplayProps) {
    const [showPlayer, setShowPlayer] = useState(false);

    const imageUrl = mediaData.image?.fileUrl;
    const imageType = mediaData.image?.fileType || "";
    const media = mediaData.media;

    const shouldShowPlayButton = media && !showPlayer;
    const isVideo = media?.fileType?.startsWith("video");

    if (!imageUrl && !media) {
        return (
            <div className={styles.card}>
                <p className={styles.noFile}>Upload image!</p>
            </div>
        );
    }

    return (
        <div className={styles.card}>
            {/* If not playing, show image with optional play overlay */}
            {!showPlayer && imageType.startsWith("image") && imageUrl && (
                <>
                    <Image
                        src={imageUrl}
                        alt="NFT Cover"
                        className={styles.image}
                        fill
                        sizes="50"
                        priority
                    />
                    {shouldShowPlayButton && (
                        <button
                            type="button"
                            className={styles.playButton}
                            onClick={() => setShowPlayer(true)}
                        >
                            <span className={styles.playOverlay}>▶</span>
                        </button>
                    )}
                </>
            )}

            {/* If playing, show media instead of image */}
            {media && showPlayer && (
                <div className={styles.mediaWrapper}>
                    {isVideo ? (
                        <video
                            src={media.fileUrl}
                            controls
                            autoPlay
                            className={styles.media}
                            onEnded={() => setShowPlayer(false)}
                        />
                    ) : (
                        <audio
                            src={media.fileUrl}
                            controls
                            autoPlay
                            className={styles.media}
                            onEnded={() => setShowPlayer(false)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
