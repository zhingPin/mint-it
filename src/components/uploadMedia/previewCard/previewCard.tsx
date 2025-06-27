"use client"
import MediaDisplay from "@/components/mediaComponent/mediaCard/mediaDisplay/mediaDisplay";
import { useMedia } from "@/(context)/useContext/useMediaContext";

function PreviewCard() {
    const { mediaData } = useMedia();



    return <div className="preview_card">
        <MediaDisplay mediaData={mediaData} />

    </div>;
}

export default PreviewCard