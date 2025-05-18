import { networkConfig } from "@/lib/chains/networkConfig";
import { networkInfo } from "@/lib/chains/networkInfo";

export function getVisibleNetworks() {
  const isProduction = process.env.NODE_ENV === "production";

  return Object.entries(networkInfo)
    .filter(
      ([key, info]) =>
        info.active && // Ensure the network is active
        (isProduction ? info.environment === "mainnet" : true) &&
        !!info.contractAddress && // Ensure contractAddress is present
        !!networkConfig[key] // Ensure the corresponding networkConfig exists
    )
    .map(([key, info]) => ({
      key,
      ...info,
      ...networkConfig[key], // Merge networkConfig into the result
    }));
};