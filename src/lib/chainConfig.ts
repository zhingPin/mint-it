import { getVisibleNetworks } from "../../helpers/networkHelpers";
import { NetworkConfigProps } from "../../types/network-types";
import { networkConfig } from "./chains/networkConfig";

// Default network
export const DEFAULT_NETWORK = process.env.DEFAULT_NETWORK || "hardhat";

if (!networkConfig[DEFAULT_NETWORK]) {
  throw new Error(`Invalid active network: ${DEFAULT_NETWORK}`);
}

// Get the current network ID
export const getCurrentNetwork = async (): Promise<number | null> => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");

    const chainId = await window.ethereum.request({ method: "net_version" });
    return Number(chainId); // Return the chain ID as a number
  } catch (err) {
    console.error("Error fetching current network:", (err as Error).message);
    return null;
  }
};

// Network switch function
const changeNetwork = async (networkName: string): Promise<void> => {

  if (!window.ethereum) throw new Error("No crypto wallet found");

  const network = networkConfig[networkName];
  if (!network) {
    throw new Error(`Network configuration not found for network: ${networkName}`);
  }

  try {
    // Attempt to switch to the network
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: network.chainId }],
    });
    console.log(`Switched to network: ${networkName}`);
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error) {
      const e = error as { code: number };
      if (e.code === 4902) {
        console.log(`Network not found. Adding network: ${networkName}`);
        await addNetwork(network, networkName);
      } else {
        console.error("Error switching network:", error);
      }
    } else {
      console.error("Unknown error switching network:", error);
    }
  }
}

// Helper function to add a network
const addNetwork = async (network: NetworkConfigProps, networkName: string): Promise<void> => {
  if (!window.ethereum) throw new Error("No crypto wallet found");

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          network
        },
      ],
    });
    console.log(`Added and switched to network: ${networkName}`);
  } catch (error) {
    console.error("Error adding network:", error);
  }
};



// Flag to prevent multiple network switch attempts at once
let isNetworkSwitchPending = false;


export const handleNetworkSwitch = async (
  networkName: string = DEFAULT_NETWORK
): Promise<string | null> => {
  if (isNetworkSwitchPending) {
    console.log("Network switch already in progress, please wait...");
    return null;
  }

  isNetworkSwitchPending = true;

  try {
    // Get the list of visible networks
    const visibleNetworks = getVisibleNetworks();
    const network = visibleNetworks.find((n) => n.key === networkName);

    if (!network) {
      throw new Error(`Network "${networkName}" is not visible or properly configured.`);
    }

    const targetChainId = parseInt(network.chainId, 16);
    const currentChainId = await getCurrentNetwork();

    if (currentChainId === targetChainId) {
      console.log("Already on the correct network:", networkName);
    } else {
      await changeNetwork(networkName);
    }

    console.log("Network switched to:", networkName);
    return networkName;
  } catch (err) {
    console.error("Error during network switch:", err);
    return null;
  } finally {
    isNetworkSwitchPending = false; // Ensure the flag is reset
  }
};