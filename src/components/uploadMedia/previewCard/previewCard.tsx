"use client"
import MediaDisplay from "@/components/mediaComponent/mediaCard/mediaDisplay/mediaDisplay";
import { useMedia } from "@/providers/mediaProvider";
import styles from "./previewCard.module.css"

function PreviewCard() {
    const { mediaData } = useMedia();



    return <div className={styles.preview_box}>
        <MediaDisplay mediaData={mediaData} />
    </div>;
}

export default PreviewCard