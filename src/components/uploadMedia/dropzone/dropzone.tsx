"use client";
import React, { useCallback } from "react";
import styles from "./dropzone.module.css";
import { useIpfs } from "@/providers/ipfsProvider";
import { useDropzone } from "react-dropzone";
import { useMedia } from "@/providers/mediaProvider";
import { NftImage, NftMedia } from "../../../../types/media-types";

// ✅ FIXED: Type guard for image MIME types
function isValidImageType(type: string | undefined): type is NftImage["fileType"] {
    return typeof type === "string" && [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp"
    ].includes(type);
}

// ✅ FIXED: Type guard for media MIME types
function isValidMediaType(type: string | undefined): type is NftMedia["fileType"] {
    return typeof type === "string" && [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "audio/mp3",
        "audio/wav"
    ].includes(type);
}


interface DropzoneProps {
    type: "image" | "media"; // Specify the type of dropzone
}

const Dropzone: React.FC<DropzoneProps> = ({ type }) => {
    const { uploadToIpfs } = useIpfs();
    const { setMediaData, setImageData } = useMedia(); // Access mediaData and setMediaData from the provider


    function formatFileSize(sizeInBytes: number): string {
        if (sizeInBytes < 1024) {
            return sizeInBytes + " B";
        } else if (sizeInBytes < 1024 * 1024) {
            return (sizeInBytes / 1024).toFixed(2) + " KB";
        } else if (sizeInBytes < 1024 * 1024 * 1024) {
            return (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB";
        } else {
            return (sizeInBytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
        }
    }

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (file) {
                try {
                    const url = await uploadToIpfs(file);
                    const fileSize = formatFileSize(file.size);
                    const fileType = file.type;

                    if (type === "image") {
                        if (isValidImageType(fileType)) {
                            setImageData({
                                fileUrl: url,
                                fileType, // ✅ TypeScript now knows this is a valid NftImage["fileType"]
                                fileSize,
                            });
                        } else {
                            console.warn("Invalid image file type:", fileType);
                        }
                    } else if (type === "media") {
                        if (isValidMediaType(fileType)) {
                            setMediaData({
                                fileUrl: url,
                                fileType, // ✅ TypeScript now knows this is a valid NftMedia["fileType"]
                                fileSize,
                            });
                        } else {
                            console.warn("Invalid media file type:", fileType);
                        }
                    }

                    console.log("File uploaded:", { url, fileType, fileSize });
                } catch (error) {
                    console.error("Upload failed:", error);
                }
            }
        },
        [uploadToIpfs, setMediaData, setImageData, type]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept:
            type === "image"
                ? { "image/*": [".jpg", ".jpeg", ".png", ".gif"] }
                : {
                    "video/*": [".mp4", ".mkv", ".avi"],
                    "audio/*": [".mp3", ".wav", ".ogg"],
                },
        maxSize: 50000000, // 50 MB
    });

    return (
        <div className={styles.dropzone_container}>
            <div {...getRootProps()} className={styles.dropzone_box}>
                <input {...getInputProps()} />
                <p>
                    Drag & drop or click to select{" "}
                    {type === "image" ? "a cover image" : "a media file"}
                </p>
            </div>
            {/* {type === "image" && mediaData?.image && (
                <div className={styles.file_info}>
                    <p>Cover Image URL: {mediaData.image.fileUrl}</p>
                    <p>File Type: {mediaData.image.fileType}</p>
                    <p>File Size: {mediaData.image.fileSize}</p>
                </div>
            )}
            {type === "media" && mediaData?.media && (
                <div className={styles.file_info}>
                    <p>Media File URL: {mediaData.media.fileUrl}</p>
                    <p>File Type: {mediaData.media.fileType}</p>
                    <p>File Size: {mediaData.media.fileSize}</p>
                </div>
            )} */}
        </div>
    );
};

export default Dropzone;