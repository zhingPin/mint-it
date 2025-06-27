"use client";

import { useWalletContext } from "@/(context)/useContext/walletContext/useWalletContext";
import { getVisibleNetworks } from "../../../../helpers/networkHelpers";
import { DEFAULT_NETWORK } from "@/(context)/useContext/walletContext/const";
import { networkInfo } from "../../../../utils/lib/chains/networkInfo";
import { handleNetworkSwitch } from "../../../../utils/helpers/wallet/switchNetwork";
import Dropdown from "@/components/layout/navbar/dropdown/dropdown";
import styles from "./chainSwitch.module.css"
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";

const ChainSwitch = () => {
    const { currentNetwork, setCurrentNetwork, currentAccount, handleConnectWallet } = useWalletContext();

    const isConnected = currentAccount !== "";

    const visibleNetworks = getVisibleNetworks();

    const selectedKey = currentNetwork || DEFAULT_NETWORK;
    const networkLogo = networkInfo[selectedKey]?.iconUrls?.[0];

    const switchNetworks = async (chainKey: string) => {
        if (!isConnected) {
            console.warn("Please connect your wallet before switching networks.");
            await handleConnectWallet(); // Optional: auto-connect
            return;
        }

        try {
            const switched = await handleNetworkSwitch(chainKey);
            if (switched) {
                setCurrentNetwork(switched);
            } else {
                console.warn("Network switch unsuccessful or cancelled by user.");
            }
        } catch (error) {
            console.error("Error switching networks:", error);
        }
    };

    // if (currentAccount) {
    //     console.log("visibleNetworks", visibleNetworks)
    //     console.log(`[chainSwitch] network: ${currentNetwork}`);
    //     console.log(`[chainSwitch] account: ${currentAccount}`);
    // }

    return (
        <Dropdown
            trigger={
                <div className={styles.chain_switch} title="Select a chain">
                    <div className={styles.greyBackground}>
                        <Image
                            className={styles.chain}
                            src={networkLogo || networkInfo[DEFAULT_NETWORK]?.iconUrls?.[0]}
                            height={25}
                            width={25}
                            alt={`${networkInfo[selectedKey]?.displayName || "Chain"} logo`}
                            title={`${networkInfo[selectedKey]?.displayName || "Chain"} logo`}
                        />

                    </div>
                    <FaChevronDown className={styles.chevron} />
                </div>
            }
            dropdownClassName={styles.menu_popover}
        >
            <ul>
                {visibleNetworks.map((network) => (
                    <li key={network.key} onClick={() => switchNetworks(network.key)}>
                        <Image
                            title={`${network.displayName}`}
                            src={network.iconUrls[0]}
                            alt={`${network.displayName} logo`}
                            height={20}
                            width={20}
                            className={styles.menuLogo}
                        />
                        <span>{network.displayName}</span>
                    </li>
                ))}
            </ul>
        </Dropdown>
    );
};

export default ChainSwitch;
