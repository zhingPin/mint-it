import { Button } from '@/components/ui';
import { NftContext } from '@/providers/nftProvider';
import { StaticImageData } from 'next/image';
import React, { useContext } from 'react';
import styles from './buyToken.module.css';

type BuyTokenProps = {
    listingId: number;
    tokenId: number;
    price: string;
    currencyIcon?: React.ReactNode | StaticImageData; // Optional icon prop
};

const BuyToken: React.FC<BuyTokenProps> = ({ listingId, tokenId, price, currencyIcon }) => {
    const nftContext = useContext(NftContext);

    if (!nftContext) {
        throw new Error("BuyToken must be used within NftProvider");
    }

    const { buyNFT } = nftContext;

    if (!buyNFT) {
        console.error("buyNFT function is not defined.");
        return null; // Return null if buyNFT is undefined
    }

    return (
        // <div className={styles.buy_token_container}>
        <Button
            btnName={` ${price}`}
            handleClick={() => buyNFT(listingId, tokenId, price)} // Pass tokenId and price
            icon={currencyIcon}
            classStyle={styles.buy_token_container}
        />
        // </div>
    );
};

export default BuyToken;