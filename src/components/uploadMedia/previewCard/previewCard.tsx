"use client"
import MediaDisplay from "@/components/mediaComponent/mediaCard/mediaDisplay/mediaDisplay";
import { useMedia } from "@/providers/mediaProvider";

function PreviewCard() {
    const { mediaData } = useMedia();



    return <div className="preview_card">
        <MediaDisplay mediaData={mediaData} />

    </div>;
}

export default PreviewCard