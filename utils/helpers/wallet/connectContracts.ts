import { Contract, ethers, Signer, Provider } from "ethers";
import { networkInfo } from "../../lib/chains/networkInfo";
import { GSOE_TOKENS_ABI, NFT_MARKETPLACE_ABI } from "@/(context)/useContext/nftContext/const";
import Web3Modal from "web3modal";


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