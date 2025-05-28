"use client";
import React, { useContext } from "react";
import Image from "next/image";

import styles from "./ChainSwitch.module.css";
import { FaChevronDown } from "react-icons/fa";
import Dropdown from "../dropdown/dropdown";
import { WokeContext } from "@/providers/context";
import { getVisibleNetworks } from "../../../../../helpers/networkHelpers";
import { handleNetworkSwitch } from "@/lib/chainConfig";
import { networkInfo } from "@/lib/chains/networkInfo";

const ChainSwitch: React.FC = () => {
  const wokeContext = useContext(WokeContext);
  if (!wokeContext) {
    throw new Error("WokeProvider must be used within WalletProvider");
  }
  const { currentNetwork, setCurrentNetwork } = wokeContext;
  const visibleNetworks = getVisibleNetworks(); // Call here to get the filtered networks

  const switchNetworks = async (chainKey: string) => {
    const switched = await handleNetworkSwitch(chainKey);
    if (switched) setCurrentNetwork(switched); // Update context only if switch is successful
  }
  const networkLogo = networkInfo[currentNetwork]?.iconUrls[0]; // Default to hardhat logo if not found
  console.log(currentNetwork)
  console.log(visibleNetworks)
  return (
    <Dropdown
      trigger={
        <div className={styles.chain_switch} title="Select a chain">
          <div className={styles.greyBackground}>
            {networkLogo && (
              <Image
                className={styles.chain}
                src={networkLogo}
                height={25}
                width={25}
                alt={`${networkInfo[currentNetwork]?.displayName || "Chain"
                  } logo`}
              />
            )}
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
              title={`${network.displayName || "Chain"} `}
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