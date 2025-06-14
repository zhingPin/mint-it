import { Contract, ethers, Signer } from "ethers";
import getWeb3Modal from "./modal";
import Web3Modal from "web3modal";

import { DEFAULT_NETWORK, GSOE_TOKENS_ABI, NFT_MARKETPLACE_ABI } from "../../const";

import { Provider } from "ethers";
import { networkInfo } from "@/lib/chains/networkInfo";
import { getVisibleNetworks } from "../../../../../helpers/networkHelpers";

interface WalletData {
  balance: string;
  address: string;
  chainId: string;
}

type ContractType = "nft" | "marketplace";


export const fetchContract = (
  signerOrProvider: Signer | Provider,
  currentNetworkKey: string,
  contractType: ContractType
): Contract => {
  const network = networkInfo[currentNetworkKey];

  if (!network) {
    throw new Error(`Unknown network key: ${currentNetworkKey}`);
  }

  const contractAddress =
    contractType === "nft"
      ? network.contracts.nft
      : network.contracts.marketplace;

  if (!contractAddress) {
    throw new Error(`No address found for ${contractType} on ${currentNetworkKey}`);
  }

  const abi = contractType === "nft" ? GSOE_TOKENS_ABI : NFT_MARKETPLACE_ABI;

  return new ethers.Contract(contractAddress, abi, signerOrProvider);
};

/**
 * Connects to the contract dynamically based on the current Network.
 * @returns {Promise<Contract | undefined>} The contract instance.
 */
export const connectToContract = async (
  currentNetworkKey: string,
  contractType: ContractType
): Promise<ethers.Contract | undefined> => {
  if (typeof window === "undefined") {
    console.log("Window is not available");
    return undefined;
  }

  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();

    const contract = fetchContract(signer, currentNetworkKey, contractType); // ✅ fixed
    console.log("Contract connected:", contract);
    return contract;
  } catch (error) {
    console.error("Error connecting to contract:", error);
    return undefined;
  }
};

export const CheckIfWalletConnected = async (): Promise<WalletData | null> => {
  try {
    if (typeof window === "undefined") return null;
    const { ethereum } = window;
    if (!ethereum) return null;

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (!accounts || accounts.length === 0) return null;

    const provider = new ethers.BrowserProvider(ethereum);
    const balanceInWei = await provider.getBalance(accounts[0]);
    const balance = ethers.formatEther(balanceInWei);

    const chainIdHex = await ethereum.request({ method: "eth_chainId" });
    const chainId = parseInt(chainIdHex, 16).toString();

    const visibleNetworks = getVisibleNetworks();
    const matchingEntry = visibleNetworks.find(
      (net) => parseInt(net.chainId, 16).toString() === chainId
    );

    const resolvedNetworkKey = matchingEntry?.key || DEFAULT_NETWORK;

    return {
      address: accounts[0],
      balance,
      chainId: resolvedNetworkKey, // Always return network key
    };
  } catch (err) {
    console.error("Error checking wallet connection:", err);
    return null;
  }
};

export const ConnectWallet = async (): Promise<WalletData | undefined> => {
  try {
    if (typeof window === "undefined") return;

    const { ethereum } = window;
    if (!ethereum) return;

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    if (!accounts || accounts.length === 0) return;

    const provider = new ethers.BrowserProvider(ethereum);
    const balanceInWei = await provider.getBalance(accounts[0]);
    const balance = ethers.formatEther(balanceInWei);

    const chainIdHex = await ethereum.request({ method: "eth_chainId" });
    const chainId = parseInt(chainIdHex, 16).toString();

    const visibleNetworks = getVisibleNetworks();
    const matchingEntry = visibleNetworks.find(
      (net) => parseInt(net.chainId, 16).toString() === chainId
    );
    const resolvedNetworkKey = matchingEntry?.key || DEFAULT_NETWORK;

    return {
      address: accounts[0],
      balance,
      chainId: resolvedNetworkKey, // use key again here
    };
  } catch (err) {
    console.error("Error connecting wallet:", err);
    return;
  }
};




export const disconnectWallet = async () => {
  await getWeb3Modal().clearCachedProvider();
  console.log("Wallet disconnected.");
};

export const handleNetworkSwitch = async (): Promise<void> => {
  if (typeof window !== "undefined") {
    const { ethereum } = window;
    if (!ethereum) {
      return; // No wallet found
    }

    const targetChainId = "0x1"; // Mainnet chain ID in hex

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetChainId }],
      });
    } catch (error) {
      console.error("Error switching network:", error);
    }
  }
}