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
            const file = acceptedFiles[0]
            if (file) {
                try {
                    const url = await uploadToIpfs(file)
                    const fileSize = formatFileSize(file.size)
                    const fileType = file.type

                    if (type === "image") {
                        if (isValidImageType(fileType)) {
                            setImageData({
                                fileUrl: url,
                                fileType,
                                fileSize,
                            })
                        } else {
                            console.warn("Invalid image file type:", fileType)
                        }
                    } else if (type === "media") {
                        if (isValidMediaType(fileType)) {
                            setMediaData({
                                fileUrl: url,
                                fileType,
                                fileSize,
                            })
                        } else {
                            console.warn("Invalid media file type:", fileType)
                        }
                    }

                    console.log("File uploaded:", { url, fileType, fileSize })
                } catch (error) {
                    console.error("Upload failed:", error)
                }
            }
        },
        [uploadToIpfs, setMediaData, setImageData, type],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept:
            type === "image"
                ? { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] }
                : {
                    "video/*": [".mp4", ".webm", ".ogg"],
                    "audio/*": [".mp3", ".wav"],
                },
        maxSize: 50000000, // 50 MB
        disabled: isLoading,
    })

    const renderIcon = () => {
        if (type === "image") return <BiImage size={40} />
        if (type === "media") return <GrMultimedia size={40} />
        return <BiUpload size={40} />
    }
    return (
        <div >
            <div {...getRootProps()} className={styles.dropzone_box}>
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