import React from "react";
import styles from "./mediaCard.module.css";
import { NftData } from "../../../../types/media-types";
import Link from "next/link";
import BuyToken from "./buyToken/buyToken";
import MediaDisplay from "./mediaDisplay/mediaDisplay";

type MediaCardProps = {
    NftData: NftData[];
};

const MediaCard: React.FC<MediaCardProps> = ({ NftData }) => {

    const nfts = NftData

    return (
        <div className={styles.media_card_grid}>
            {nfts.map((el, index) => (
                <div key={index} className={styles.media_card}>
                    <div className={styles.display}>
                        <MediaDisplay mediaData={{ image: el.image, media: el.media }} />
                    </div>
                    <div className={styles.info_card}>
                        <p className={styles.media_card_title}>{el.name}</p>
                        <p className={styles.description}>{el.description}</p>
                        <div className={styles.info_card_action}>
                            <Link
                                href={{ pathname: `/media/${el.tokenId}` }}>
                                <h4>info</h4>
                            </Link>
                            <BuyToken listingId={el.listingId} tokenId={el.tokenId} price={el.price} />

                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MediaCard;