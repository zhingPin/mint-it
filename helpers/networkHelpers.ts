import { networkConfig } from "@/lib/chains/networkConfig";
import { networkInfo } from "@/lib/chains/networkInfo";

export function getVisibleNetworks() {
  const isProduction = process.env.NODE_ENV === "production";

  return Object.entries(networkInfo)
    .filter(([key, info]) => {
      const hasConfig = !!networkConfig[key];

      if (!hasConfig) {
        console.warn(`Missing config for network: ${key}`);
      }

      return (
        info.active &&
        (isProduction ? info.environment === "mainnet" : true) &&
        !!info.contracts?.nft &&
        !!info.contracts?.marketplace &&
        hasConfig
      );
    })
    .map(([key, info]) => ({
      key,
      ...info,
      ...networkConfig[key],
    }));
}
