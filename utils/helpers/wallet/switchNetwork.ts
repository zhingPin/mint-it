import { DEFAULT_NETWORK } from "@/(context)/useContext/walletContext/const";
import { getCurrentNetwork, getVisibleNetworks } from "../../../helpers/networkHelpers";
import { NetworkConfigProps } from "../../../types/network-types";
import { networkConfig } from "../../lib/chains/networkConfig";


// Network switch function
const changeNetwork = async (networkName: string): Promise<void> => {

    if (!window.ethereum) throw new Error("No crypto wallet found");

    const network = networkConfig[networkName];
    if (!network) {
        throw new Error(`Network configuration not found for network: ${networkName}`);
    }
    console.log(`[changeNetwork] Attempting wallet_switchEthereumChain with chainId: ${network.chainId}`);

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
                console.warn("Error switching network:", error);
            }
        } else {
            console.warn("Unknown error switching network:", error);
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
        console.log("[NetworkSwitch] A network switch is already in progress. Aborting new attempt...");
        return null;
    }

    isNetworkSwitchPending = true;
    console.log(`[NetworkSwitch] Starting network switch to: "${networkName}"`);

    try {
        const visibleNetworks = getVisibleNetworks();
        console.log("[NetworkSwitch] Visible networks:", visibleNetworks.map(n => n.key));

        const network = visibleNetworks.find((n) => n.key === networkName);
        if (!network) {
            throw new Error(`[NetworkSwitch] Network "${networkName}" is not visible or configured.`);
        }

        const targetChainId = parseInt(network.chainId, 16);
        console.log(`[NetworkSwitch] Target chain ID (decimal): ${targetChainId} (hex: ${network.chainId})`);

        const currentChainId = await getCurrentNetwork();
        console.log(`[NetworkSwitch] Current chain ID: ${currentChainId}`);

        if (currentChainId === targetChainId) {
            console.log(`[NetworkSwitch] Already connected to the correct network: "${networkName}"`);
        } else {
            console.log(`[NetworkSwitch] Attempting to switch to network: "${networkName}"`);
            await changeNetwork(networkName);
        }

        console.log(`[NetworkSwitch] Successfully switched to: "${networkName}"`);
        return networkName;
    } catch (err) {
        console.error("[NetworkSwitch] Error during network switch:", err);
        return null;
    } finally {
        isNetworkSwitchPending = false;
        console.log("Network switch process completed",);
    }
};
