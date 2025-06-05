"use client";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./mediaDetails.module.css";
import { NftData } from "../../../../types/media-types";
import { WalletContext } from "@/providers/walletProvider";
import { Button } from "@/components/ui";
import { FaWallet } from "react-icons/fa";
import MediaDisplay from "@/components/mediaComponent/mediaCard/mediaDisplay/mediaDisplay";
import { shortenAddress } from "../../../../utils/address";
import { NftContext } from "@/providers/nftProvider";

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
    const listingId = Number(id)
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
        <div >
            <div className={styles.nft_detail_card}>
                {/* Media Section */}
                <div className="preview_card">
                    <MediaDisplay mediaData={media} />
                </div>

                {/* Details Section */}
                <div className={styles.details_section}>
                    <h2 className={styles.nft_title}>{media.name}</h2>
                    <div className={styles.nft_description}>
                        {media.description || "No description available."}
                    </div>

                    <div className={styles.meta_grid}>
                        {media.creator && (
                            <div className={styles.meta_item}>
                                <strong>Creator:</strong> {shortenAddress(media.creator)}
                            </div>
                        )}
                        {media.royaltyPercentage !== undefined && (
                            <div className={styles.meta_item}>
                                <strong>Royalties:</strong> {media.royaltyPercentage}%
                            </div>
                        )}
                        {media.quantity !== undefined && (
                            <div className={styles.meta_item}>
                                <strong>Quantity:</strong> {media.quantity}
                            </div>
                        )}
                        <div className={styles.meta_item}>
                            <strong>Price:</strong> {media.price} ETH
                        </div>
                    </div>

                    {/* Action Button */}
                    {isSeller ? (
                        <Button
                            icon={<FaWallet />}
                            btnName="Already Listed by you"
                            handleClick={() => { }}
                            classStyle={styles.buy_button}
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
                            classStyle={styles.buy_button}
                        />
                    ) : currentAccount ? (
                        <Button
                            icon={<FaWallet />}
                            btnName="Buy NFT"
                            handleClick={() => buyNFT(media.listingId, tokenId, media.price)}
                            classStyle={styles.buy_button}
                        />
                    ) : (
                        <Button
                            icon={<FaWallet />}
                            btnName="Connect Wallet"
                            handleClick={() => {
                                // Add connect wallet logic here if needed
                            }}
                            classStyle={styles.buy_button}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaDetails;
