import type React from "react"
import styles from "./mediaCard.module.css"
import type { NftData } from "../../../../types/media-types"
import Link from "next/link"
import BuyToken from "./buyToken/buyToken"
import MediaDisplay from "./mediaDisplay/mediaDisplay"
import MediaCardInfo from "./mediaCardInfo/mediaCardInfo"
import { FaEthereum } from "react-icons/fa"
import { networkInfo } from "@/lib/chains/networkInfo"
import { shortenAddress } from "../../../../utils/address"

type MediaCardProps = {
    NftData: NftData[]
}

const MediaCard: React.FC<MediaCardProps> = ({ NftData }) => {
    const nfts = NftData

    return (
        <div className={styles.media_card_grid}>
            {nfts.map((el, index) => {
                const networkMeta = networkInfo[el.chainId]
                const networkLogo = networkMeta?.iconUrls?.[0]

                return (
                    <div key={index} className={`${styles.media_card} ${el.isSeller ? styles.seller_card : ""}`}>
                        <div className={styles.display}>
                            <MediaDisplay mediaData={{ image: el.image, media: el.media }} />
                        </div>

                        <div className={styles.info_card}>

                            <MediaCardInfo
                                name={el.name}
                                tokenId={el.tokenId.toString()}
                                description={el.description}
                                price={el.price}
                                creator={el.creator || "0x1234567890abcdef1234567890abcdef12345678"}
                                isSeller={el.isSeller}
                                ownedByCurrentUser={el.ownedByCurrentUser}
                                listingId={el.listingId.toString()}
                            />

                            <div className={styles.info_card_action}>
                                <Link href={{ pathname: `/media/${el.tokenId}` }} className={styles.info_link}>
                                    <span>Details</span>
                                </Link>
                                <div className={styles.creator_info}>
                                    <span className={styles.creator_label}>Creator: </span>
                                    <Link href={`/profile/${el.creator}`} className={styles.creator_address}>
                                        {shortenAddress(el.creator)}
                                    </Link>
                                </div>
                                {!el.isSeller && !el.ownedByCurrentUser && (
                                    <BuyToken
                                        listingId={el.listingId}
                                        tokenId={el.tokenId}
                                        price={el.price}
                                        currencyIcon={
                                            networkLogo ? (
                                                networkLogo // Pass the string URL directly
                                            ) : (
                                                <FaEthereum />
                                            )
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MediaCard
