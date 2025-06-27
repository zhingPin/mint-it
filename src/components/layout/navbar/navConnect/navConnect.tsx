"use client";
import styles from "./navConnect.module.css";
import { shortenAddress } from "../../../../../utils/hooks/address";
import ChainSwitch from "../ChainSwitch/ChainSwitch";
import Button from "@/components/ui/button/button";
import { useWalletContext } from "@/(context)/useContext/walletContext/useWalletContext";

const NavConnect = () => {
  const { currentAccount, handleConnectWallet } = useWalletContext();

  const handleConnectClick = async () => {
    if (handleConnectWallet) {
      try {
        await handleConnectWallet();
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    }
  };

  return (
    <div className={styles.connect_container}>
      <ChainSwitch />
      <div className="nav_btn_container">
        {currentAccount ? (
          <Button
            btnName={shortenAddress(currentAccount)}
            classStyle={styles.connect}
          />
        ) : (
          <Button
            btnName="Connect"
            classStyle={styles.connect}
            handleClick={handleConnectClick}
          />
        )}
      </div>
    </div>
  );
};

export default NavConnect;