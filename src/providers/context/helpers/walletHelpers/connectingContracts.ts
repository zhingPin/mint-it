import { Contract, ethers, Signer } from "ethers";
import getWeb3Modal from "./modal";
import Web3Modal from "web3modal";

import { WOKE_ABI } from "../../const";
import { Provider } from "ethers";
import { networkInfo } from "@/lib/chains/networkInfo";

interface WalletData {
  balance: string;
  address: string;
  chainId: number | string;
}

export const fetchContract = (
  signerOrProvider: Signer | Provider,
  currentNetworkKey: string
): Contract => {
  const contractAddress = networkInfo[currentNetworkKey]?.contractAddress;
  if (!contractAddress) {
    throw new Error(`No contract address found for network: ${currentNetworkKey}`);
  }

  return new ethers.Contract(contractAddress, WOKE_ABI, signerOrProvider);
};


/**
 * Connects to the contract dynamically based on the current Network.
 * @returns {Promise<Contract | undefined>} The contract instance.
 */
export const connectToContract = async (
  currentNetworkKey: string
): Promise<ethers.Contract | undefined> => {
  if (typeof window === "undefined") {
    console.log("Window is not available");
    return undefined; // Ensure this doesn't run server-side
  }

  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();

    // Fetch the contract using the current network key
    const contract = fetchContract(signer, currentNetworkKey);
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

    const { ethereum } = window as any;
    if (!ethereum) return null;

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (!accounts || accounts.length === 0) {
      console.log("No accounts found.");
      return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const balanceInWei = await provider.getBalance(accounts[0]);
    const balance = ethers.formatEther(balanceInWei);
    const chainId = await ethereum.request({ method: "eth_chainId" });

    return {
      address: accounts[0],
      balance,
      chainId,
    };
  } catch (err) {
    console.error("Error checking wallet connection:", err);
    return null;
  }
};




export const ConnectWallet = async (): Promise<WalletData | undefined> => {
  try {
    if (typeof window === "undefined") {
      console.log("MetaMask not installed. Please install MetaMask to continue.");
      return undefined;
    }

    const { ethereum } = window as any;
    if (!ethereum) {
      console.log("Ethereum object not found. Please install MetaMask.");
      return undefined;
    }



    // Request accounts from the wallet
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts || accounts.length === 0) {
      console.log("No accounts found.");
      return undefined;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner(accounts[0]);

    const balanceInWei = await provider.getBalance(accounts[0]);
    const balance = ethers.formatEther(balanceInWei);
    const chainId = await ethereum.request({ method: "eth_chainId" });

    return {
      address: accounts[0],
      balance,
      chainId,
    };
  } catch (err) {
    console.error("Error connecting wallet:", err);
    return undefined;
  }
};



export const disconnectWallet = async () => {
  await getWeb3Modal().clearCachedProvider();
  console.log("Wallet disconnected.");
};

export const handleNetworkSwitch = async (): Promise<void> => {
  if (typeof window !== "undefined") {
    const { ethereum } = window as any;
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