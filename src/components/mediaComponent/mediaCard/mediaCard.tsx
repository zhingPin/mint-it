import React from "react";
import styles from "./mediaCard.module.css";
import { NftData } from "../../../../types/media-types";
import Link from "next/link";
import BuyToken from "./buyToken/buyToken";
import MediaDisplay from "./mediaDisplay/mediaDisplay";
import { usePathname } from "next/navigation";

type MediaCardProps = {
    NftData: NftData[];
};

const MediaCard: React.FC<MediaCardProps> = ({ NftData }) => {
    const pathname = usePathname();

    const nfts = NftData

    return (
        <div className={styles.media_card_container}>
            {nfts.map((el, index) => (
                <div key={index} className={styles.media_card}>
                    <MediaDisplay mediaData={{ image: el.image, media: el.media }} />
                    <div className={styles.info_card}>
                        <p className={styles.media_card_title}>{el.name}</p>

                        <p className={styles.description}>{el.description}</p>
                        <div className="flex">
                            <Link
                                href={{ pathname: `/media/${el.tokenId}` }}>
                                <h4>info</h4>
                            </Link>
                            <BuyToken
                                tokenId={el.tokenId ? Number(el.tokenId) : 0} // Ensure tokenId is a number
                                price={el.price ? String(el.price) : "0"} // Ensure price is a string
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MediaCard;