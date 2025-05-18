"use client"
import React, { useState } from 'react'
import styles from "./mediaDisplay.module.css"
import { NftImage, NftMedia } from '../../../../../types/media-types';
import Image from 'next/image';


export interface MediaData {
    image: NftImage;      // required cover
    media?: NftMedia;     // optional video / audio
}

interface MediaDisplayProps {
    mediaData: MediaData;
}

export default function MediaDisplay({ mediaData }: MediaDisplayProps) {
    const [showPlayer, setShowPlayer] = useState(false);
    if (!mediaData?.image.fileUrl && !mediaData?.media) {
        return <p className={styles.noFile}>No file uploaded yet.</p>;
    }

    const hasMedia = Boolean(mediaData.media);
    console.log("mediaData", mediaData)
    return (
        <div className={styles.card}>
            {/* ---- Cover or Media ---- */}
            {!showPlayer || !hasMedia ? (
                /* Cover image (acts as play button if media exists) */
                <button
                    type="button"
                    className={styles.imageWrapper}
                    onClick={() => hasMedia && setShowPlayer(true)}
                >
                    <Image
                        src={mediaData.image.fileUrl}
                        alt="Uploaded cover"
                        fill
                        className={styles.image}
                    />
                    {hasMedia && <span className={styles.playOverlay}>▶</span>}
                </button>
            ) : (
                /* Media player (shown after click) */
                <div className={styles.mediaWrapper}>
                    {mediaData.media!.fileType?.startsWith("video") ? (
                        <video
                            src={mediaData.media!.fileUrl}
                            controls
                            autoPlay
                            className={styles.media}
                            onEnded={() => setShowPlayer(false)} // 👈 Return to image after playback

                        />
                    ) : (
                        <audio
                            src={mediaData.media!.fileUrl}
                            controls
                            autoPlay
                            className={styles.media}
                            onEnded={() => setShowPlayer(false)} // 👈 Return to image after playback

                        />
                    )}
                </div>
            )}
        </div>)
}

// export default MediaDisplay