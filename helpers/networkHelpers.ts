import { networkConfig } from "@/lib/chains/networkConfig";
import { networkInfo } from "@/lib/chains/networkInfo";

export function getVisibleNetworks() {
  const isProduction = process.env.NODE_ENV === "production";

  return Object.entries(networkInfo)
    .filter(([key, info]) =>
      info.active &&
      (isProduction ? info.environment === "mainnet" : true) &&
      !!info.contracts?.nft &&
      !!info.contracts?.marketplace &&
      !!networkConfig[key]
    )
    .map(([key, info]) => ({
      key,
      ...info,
      ...networkConfig[key],
    }));
}
