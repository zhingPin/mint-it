"use client";
import React, { useCallback } from "react";
import styles from "./dropzone.module.css";
import { useIpfs } from "@/providers/ipfsProvider";
import { useDropzone } from "react-dropzone";
import { useMedia } from "@/providers/mediaProvider";
import { NftImage, NftMedia } from "../../../../types/media-types";
import { BiUpload, BiImage } from "react-icons/bi";
import { GrMultimedia } from "react-icons/gr";

// Type guard for image MIME types
function isValidImageType(type: string | undefined): type is NftImage["fileType"] {
    return typeof type === "string" && ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp"].includes(type)
}

// Type guard for media MIME types
function isValidMediaType(type: string | undefined): type is NftMedia["fileType"] {
    return typeof type === "string" && ["video/mp4", "video/webm", "video/ogg", "audio/mp3", "audio/wav"].includes(type)
}

interface DropzoneProps {
    type: "image" | "media"
}

const Dropzone: React.FC<DropzoneProps> = ({ type }) => {
    const { uploadToIpfs, isLoading } = useIpfs()
    const { setMediaData, setImageData } = useMedia()

    function formatFileSize(sizeInBytes: number): string {
        if (sizeInBytes < 1024) {
            return sizeInBytes + " B"
        } else if (sizeInBytes < 1024 * 1024) {
            return (sizeInBytes / 1024).toFixed(2) + " KB"
        } else if (sizeInBytes < 1024 * 1024 * 1024) {
            return (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB"
        } else {
            return (sizeInBytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
        }
    }

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            const fileType = file.type;
            const fileSize = formatFileSize(file.size);

            try {
                // 👇 Example call to the new hello route

                const res = await fetch("/api/ipfs-upload/preview", {
                    method: "GET",
                });
                const data = await res.json();
                console.log("Hello API response:", data);


                // 👇 Prepare form data for POST
                const formData = new FormData();
                formData.append("file", file);

                // // 👇 Call POST /api/ipfs-upload/preview with file
                // const response = await fetch("/api/ipfs-upload/preview", {
                //     method: "POST",
                //     body: formData,
                // });
                if (type === "image" && isValidImageType(fileType)) {
                    const url = await uploadToIpfs(file);

                    setImageData({
                        fileUrl: url,
                        fileType,
                        fileSize,
                    });

                    console.log("Image uploaded:", { url, fileType, fileSize });
                } else if (type === "media" && isValidMediaType(fileType)) {
                    // 👇 For now, just upload full file directly
                    const url = await uploadToIpfs(file);

                    setMediaData({
                        fileUrl: url,
                        previewUrl: "", // no preview now
                        fileType,
                        fileSize,
                        previewDuration: 0,
                    });

                    console.log("Media uploaded without preview:", { url });
                } else {
                    console.warn("Invalid file type:", fileType);
                }
            } catch (err) {
                console.error("Upload or processing failed:", err);
            }
        },
        [type, setMediaData, setImageData, uploadToIpfs]
    );


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept:
            type === "image"
                ? { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] }
                : {
                    "video/*": [".mp4", ".webm", ".ogg"],
                    "audio/*": [".mp3", ".wav"],
                },
        maxSize: 500000000, // 500 MB
        disabled: isLoading,
    })

    const renderIcon = () => {
        if (type === "image") return <BiImage size={40} />
        if (type === "media") return <GrMultimedia size={40} />
        return <BiUpload size={40} />
    }
    return (
        <div >
            <div
                {...getRootProps()}
                className={`${styles.dropzone_box} ${isDragActive ? styles.active : ""}`}
            >
                <input {...getInputProps()} />
                <div className={styles.icon_stack}>
                    {renderIcon()}
                </div>

                <p>
                    <BiUpload className={styles.upload_overlay} />
                    {type === "image" ? "Image" : "Media file"}
                </p>
            </div>

        </div>
    );
};

export default Dropzone;