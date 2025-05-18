import { Button } from '@/components/ui';
import { NftContext } from '@/providers/nftProvider';
import React, { useContext } from 'react';

type BuyTokenProps = {
    tokenId: number;
    price: string;
};

const BuyToken: React.FC<BuyTokenProps> = ({ tokenId, price }) => {
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
        <div>
            <Button
                btnName={`buy for ${price}eth`}
                handleClick={() => buyNFT(tokenId, price)} // Pass tokenId and price
            />
        </div>
    );
};

export default BuyToken;