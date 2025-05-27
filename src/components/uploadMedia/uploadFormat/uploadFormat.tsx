"use client";
import { useMedia } from '@/providers/mediaProvider';
import styles from './uploadFormat.module.css';
// This component is used to display the upload format for media and images.
import React from 'react'

const UploadFormat = () => {
    const { mediaData } = useMedia();
    const hasMedia = Boolean(mediaData.media);
    const hasImage = Boolean(mediaData.image);

    return (
        <div className={styles.meta}>
            {hasImage && (
                <div className={styles.meta_sections}>
                    <strong>Image&nbsp;format:</strong> {mediaData.image.fileType} &nbsp;&nbsp;
                    <strong>Image&nbsp; Size:</strong> {mediaData.image.fileSize}
                    {/* <span><strong>Image format:</strong></span>
                    <span>{mediaData.image.fileType}</span>
                    <span><strong>Image size:</strong></span>
                    <span>{mediaData.image.fileSize}</span> */}
                </div>
            )}
            {hasMedia && (
                <div className={styles.meta_sections}>
                    <span><strong>Media type:</strong></span>
                    <span>{mediaData.media!.fileType}</span>
                    <span><strong>Media size:</strong></span>
                    <span>{mediaData.media!.fileSize}</span>
                </div>
            )}
        </div>
    );
};

export default UploadFormat;