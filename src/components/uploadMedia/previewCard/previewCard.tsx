"use client"
import MediaDisplay from "@/components/mediaComponent/mediaCard/mediaDisplay/mediaDisplay";
import { useMedia } from "@/providers/mediaProvider";
import styles from "./previewCard.module.css";


function PreviewCard() {
    const { mediaData } = useMedia();

    const hasMedia = Boolean(mediaData.media);


    return <div><MediaDisplay mediaData={mediaData} />
        {/* ---- Meta ---- */}
        <div className={styles.meta}>
            <p>
                <strong>Image&nbsp;format:</strong> {mediaData.image.fileType} &nbsp;&nbsp;
                <strong>Size:</strong> {mediaData.image.fileSize}
            </p>
            {hasMedia && (
                <p>
                    <strong>Media&nbsp;type:</strong> {mediaData.media!.fileType} &nbsp;&nbsp;
                    <strong>Size:</strong> {mediaData.media!.fileSize}
                </p>
            )}
        </div>
    </div>;
}

export default PreviewCard