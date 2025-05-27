"use client";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./mediaDetails.module.css";
import { NftData } from "../../../../types/media-types";
import { NftContext } from "@/providers/nftProvider";
import { WalletContext } from "@/providers/walletProvider";
import { Button } from "@/components/ui";
import { FaWallet } from "react-icons/fa";
import MediaDisplay from "@/components/mediaComponent/mediaCard/mediaDisplay/mediaDisplay";
import { shortenAddress } from "../../../../utils/address";

const MediaDetails = () => {
    const nftContext = useContext(NftContext);
    const walletContext = useContext(WalletContext);

    if (!nftContext || !walletContext) {
        throw new Error("MediaDetails must be used within NftProvider and WalletProvider");
    }

    const { fetchMarketsNFTs, buyNFT } = nftContext;
    const { currentAccount } = walletContext;

    const { id } = useParams();
    const [media, setMedia] = useState<NftData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const tokenId = Number(id);
    const router = useRouter();

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const allNFTs = (await fetchMarketsNFTs()) || [];
                const selectedMedia = allNFTs.find((item) => Number(item.tokenId) === tokenId);
                setMedia(selectedMedia || null);
            } catch (error) {
                console.error("Error fetching media details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (tokenId) {
            fetchMedia();
        }
    }, [tokenId, fetchMarketsNFTs]);

    if (loading) return <p>Loading media details...</p>;
    if (!media) return <p>Media not found.</p>;

    const isSeller = currentAccount?.toLowerCase() === media.seller?.toLowerCase();
    const isOwner = currentAccount?.toLowerCase() === media.owner?.toLowerCase();

    return (
        <div className={styles.media_details}>
            <MediaDisplay mediaData={media} />

            <div className={styles.media_info}>
                <h2>{media.name}</h2>
                <div className={styles.media_metadata}>
                    {media.description && <p><strong> Description:</strong> {media.description}</p>}
                    {media.creator && <p><strong>Creator:</strong> {shortenAddress(media.creator)}</p>}
                    {media.royaltyPercentage !== undefined && (
                        <p><strong>Royalties:</strong> {media.royaltyPercentage}%</p>
                    )}
                    {media.genre && <p><strong>Genre:</strong> {media.genre}</p>}
                    {media.collection && <p><strong>Collection:</strong> {media.collection}</p>}
                    {media.credits && <p><strong>Credits:</strong> {media.credits}</p>}
                    {media.quantity !== undefined && (
                        <p><strong>Quantity:</strong> {media.quantity}</p>
                    )}
                    {media.website && (
                        <p>
                            <strong>Website:</strong>{" "}
                            <a href={media.website} target="_blank" rel="noopener noreferrer">
                                {media.website}
                            </a>
                        </p>
                    )}
                    <p><strong>Price:</strong> {media.price} ETH</p>
                </div>

                {isSeller ? (
                    <Button
                        icon={<FaWallet />}
                        btnName="Already Listed by you"
                        handleClick={() => { }}
                        classStyle={styles.button}
                    />
                ) : isOwner ? (
                    <Button
                        icon={<FaWallet />}
                        btnName="List on Marketplace"
                        handleClick={() =>
                            router.push(
                                `/resellToken?id=${media.tokenId}&tokenURI=${media.tokenURI}&price=${media.price}`
                            )
                        }
                        classStyle={styles.button}
                    />
                ) : currentAccount ? (
                    <Button
                        icon={<FaWallet />}
                        btnName="Buy NFT"
                        handleClick={() => buyNFT(tokenId, media.price)}
                        classStyle={styles.button}
                    />
                ) : (
                    <Button
                        icon={<FaWallet />}
                        btnName="Connect Wallet"
                        handleClick={() => {
                            // connect wallet logic
                        }}
                        classStyle={styles.button}
                    />
                )}
            </div>
        </div>




    );
};

export default MediaDetails;
