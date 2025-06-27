"use client"
import { useWalletContext } from '@/(context)/useContext/walletContext/useWalletContext';
import React from 'react'
import { shortenAddress } from '../../../../utils/hooks/address';


const ConnectButton = () => {
    const { currentAccount, handleConnectWallet } = useWalletContext();
    const isConnected = currentAccount !== "";
    const accountDisplay = isConnected ? shortenAddress(currentAccount) : "Connect Wallet";

    const handleClick = async () => {
        if (!isConnected) {
            await handleConnectWallet();
        }
    };

    return (
        <button onClick={handleClick}>
            {accountDisplay}
        </button>
    );
};

export default ConnectButton;
