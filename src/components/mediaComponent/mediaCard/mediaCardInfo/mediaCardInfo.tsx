import type React from "react"
import styles from "./mediaCardInfo.module.css"

import { BiTimeFive } from "react-icons/bi"
import { AiOutlineHeart } from "react-icons/ai"

interface MediaCardInfoProps {
    tokenId: string
    name?: string
    description?: string
    price: string
    creator: string
    likes?: number
    timeLeft?: string
    isSeller?: boolean
    ownedByCurrentUser?: boolean
    listingId?: string
}

const MediaCardInfo: React.FC<MediaCardInfoProps> = ({
    name,
    description,

    likes = 0,
    timeLeft,

}) => {
    return (
        <div className={styles.card_info_container}>
            <div className={styles.card_info_header}>
                <h3>{name}</h3>
                <div className={styles.likes}>
                    <AiOutlineHeart />
                    <span>{likes}</span>
                </div>
            </div>
            {description}
            <div className={styles.details_container}>



                <div className={styles.stats_container}>
                    {timeLeft && (
                        <div className={styles.time_left}>
                            <BiTimeFive />
                            <span>{timeLeft}</span>
                        </div>
                    )}


                </div>
            </div>

            {/* <div className={styles.status_container}>
                {isSeller && <span className={styles.status_tag}>Listed</span>}
                {ownedByCurrentUser && <span className={styles.status_tag}>Owned</span>}
                {!isSeller && !ownedByCurrentUser && <span className={styles.status_tag}>For Sale</span>}
            </div> */}
        </div>
    )
}

export default MediaCardInfo
