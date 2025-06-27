import { Button } from '@/components/ui';
import { StaticImageData } from 'next/image';
import styles from './buyToken.module.css';
import { useNftContext } from '@/(context)/useContext/nftContext/useNftContext.ts';

type BuyTokenProps = {
    listingId: number;
    tokenId: number;
    price: string;
    currencyIcon?: React.ReactNode | StaticImageData; // Optional icon prop
};

const BuyToken: React.FC<BuyTokenProps> = ({ listingId, tokenId, price, currencyIcon }) => {


    const { buyNFT } = useNftContext();

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